export interface TreeItem {
  id: number | string
  parentId: number | string | null
  children?: TreeItem[]
  [key: string]: unknown
}

export function buildTree<T extends TreeItem>(items: T[]): T[] {
  const map = new Map<number | string, T>()
  const tree: T[] = []

  items.forEach((item) => {
    map.set(item.id, { ...item, children: [] })
  })

  items.forEach((item) => {
    const node = map.get(item.id)!
    if (item.parentId === null || item.parentId === 0 || !map.has(item.parentId!)) {
      tree.push(node)
    } else {
      const parent = map.get(item.parentId!)
      if (parent) {
        ;(parent.children as T[]).push(node)
      }
    }
  })

  return tree
}

export function flattenTree<T extends TreeItem>(tree: T[]): T[] {
  const result: T[] = []
  function walk(nodes: T[]) {
    nodes.forEach((node) => {
      result.push(node)
      if (node.children && node.children.length > 0) {
        walk(node.children as T[])
      }
    })
  }
  walk(tree)
  return result
}

export function findNode<T extends TreeItem>(
  tree: T[],
  predicate: (node: T) => boolean
): T | null {
  for (const node of tree) {
    if (predicate(node)) return node
    if (node.children) {
      const found = findNode(node.children as T[], predicate)
      if (found) return found
    }
  }
  return null
}
