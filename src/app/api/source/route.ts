import { readFile } from "node:fs/promises"
import path from "node:path"
import { getComponentBySlug } from "@/lib/components"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get("name")
  if (!name) {
    return new Response("Missing 'name' query parameter.", { status: 400 })
  }

  const component = getComponentBySlug(name)
  // Target path in src/components/ui/
  const relativeFile = component?.filePath
    ? path.join("src", component.filePath)
    : path.join("src", "components", "ui", `${name}.tsx`)

  try {
    const absolutePath = path.join(process.cwd(), relativeFile)
    const code = await readFile(absolutePath, "utf-8")
    return new Response(code, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "public, max-age=3600",
      },
    })
  } catch {
    return new Response(`Unable to read source for component '${name}'.`, { status: 404 })
  }
}
