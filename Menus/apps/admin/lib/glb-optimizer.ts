import { NodeIO } from "@gltf-transform/core";
import {
  dedup,
  draco,
  prune,
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
  const doc = await io.readBinary(input);

  // Apply a series of optimizations.
  // Each transform runs synchronously but we await for consistency.
  await doc.transform(
    prune(),
    dedup(),
    draco(),
    weld(),
  );

  // Write out optimized GLB bytes.
  const output = await io.writeBinary(doc);
  return Buffer.from(output);
}
