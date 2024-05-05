export function ownerDocument(node: Node | null | undefined): Document {
	return (node && node.ownerDocument) || document
}

export default function ownerWindow(node: Node | undefined): Window {
	const doc = ownerDocument(node)
	return doc.defaultView || window
}
