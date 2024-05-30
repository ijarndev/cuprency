export const logAction = (source, message) => {
  const realFileName = source.split('\\')
  const lastIndex = realFileName.length - 1
  
  console.log(`[${realFileName[lastIndex]}]`, message)
}