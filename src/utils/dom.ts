export const setMetaContent = (selector: string, value: string) => {
  const element = document.head.querySelector<HTMLMetaElement>(selector)

  if (element) {
    element.content = value
  }
}
