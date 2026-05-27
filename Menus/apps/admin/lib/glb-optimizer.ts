import { Document, NodeIO } from "@gltf-transform/core";
import {
  dedup,
  draco,
  prune,
  textureCompress,
  weld,
} from "@gltf-transform/functions";

/**
 * Optimize a GLB buffer for mobile AR.
 * Applies pruning, deduplication, texture compression, Draco mesh compression, and vertex welding.
 * Returns a new Buffer containing the optimized GLB.
 */
export async function optimizeGlb(input: Buffer): Promise<Buffer> {
  // Load the GLB into a Document
  const io = new NodeIO();
  const doc: Document = io.readBinary(input);

  // Apply a series of optimizations.
  // Each transform runs synchronously but we await for consistency.
  await doc.transform(
    prune(), // remove unused nodes, materials, accessors, etc.
    dedup(), // deduplicate geometry and textures
    textureCompress({
      // Use ASTC for mobile devices; fallback to ETC2 if not supported.
      // Quality is a trade‑off between size and visual fidelity.
      mode: "astc",
      quality: 0.6,
    }),
    draco({
      // Draco compression level (0‑10). Higher values increase compression.
      compressionLevel: 10,
      // Encode all meshes.
      encodeSpeed: 5,
      decodeSpeed: 5,
    }),
    weld(), // merge duplicate vertices
  );

  // Write out optimized GLB bytes.
  const output = io.writeBinary(doc);
  return Buffer.from(output);
}
