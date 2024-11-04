const handleColorLayerClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const color = target.getAttribute('data-color')

  if (color && navigator.clipboard) {
    navigator.clipboard.writeText(color)
  }
}

export default handleColorLayerClick
