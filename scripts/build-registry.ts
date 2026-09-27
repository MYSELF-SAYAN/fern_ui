/**
 * Build script to generate static registry JSON files
 * for distribution via public/ directory or any static host.
 *
 * Usage: npx tsx scripts/build-registry.ts
 *
 * Output: public/r/<component-name>.json for each registry item
 */

import * as fs from "fs"
import * as path from "path"

const ROOT = path.resolve(__dirname, "..")
const REGISTRY_PATH = path.join(ROOT, "registry.json")
const OUTPUT_DIR = path.join(ROOT, "public", "r")

interface RegistryFile {
  path: string
  type: string
  target?: string
}

interface RegistryItem {
  name: string
  type: string
  title?: string
  description?: string
  dependencies?: string[]
  registryDependencies?: string[]
  files: RegistryFile[]
}

interface Registry {
  $schema: string
  name: string
  homepage: string
  items: RegistryItem[]
}

function main() {
  console.log("📦 Building registry...")

  // Read registry manifest
  const registryContent = fs.readFileSync(REGISTRY_PATH, "utf-8")
  const registry: Registry = JSON.parse(registryContent)

  // Clean and ensure output directory exists
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true, force: true })
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })

  let count = 0

  for (const item of registry.items) {
    // Read file contents
    const filesWithContent = item.files.map((file) => {
      const filePath = path.join(ROOT, file.path)
      if (!fs.existsSync(filePath)) {
        console.warn(`  ⚠️  File not found: ${file.path} (for ${item.name})`)
        return { ...file, content: "" }
      }
      const content = fs.readFileSync(filePath, "utf-8")
      return { ...file, content }
    })

    // Build the registry item JSON
    const registryItem = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: item.name,
      type: item.type,
      title: item.title || item.name,
      description: item.description || "",
      dependencies: item.dependencies || [],
      registryDependencies: item.registryDependencies || [],
      files: filesWithContent,
      cssVars: {},
      meta: {},
    }

    // Write to public/r/<name>.json
    const outputPath = path.join(OUTPUT_DIR, `${item.name}.json`)
    fs.writeFileSync(outputPath, JSON.stringify(registryItem, null, 2))
    count++
  }

  // Also generate an index file listing all items
  const indexItems = registry.items.map((item) => ({
    name: item.name,
    type: item.type,
    title: item.title || item.name,
    description: item.description || "",
    dependencies: item.dependencies || [],
    registryDependencies: item.registryDependencies || [],
  }))

  const index = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: registry.name,
    homepage: registry.homepage,
    items: indexItems,
  }

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "index.json"),
    JSON.stringify(index, null, 2)
  )

  console.log(`\n✅ Built ${count} registry items to public/r/`)
  console.log(`📄 Registry index: public/r/index.json`)
  console.log(`\n🚀 Users can install components via:`)
  console.log(
    `   npx shadcn add ${registry.homepage}/r/<component-name>.json`
  )
}

main()
