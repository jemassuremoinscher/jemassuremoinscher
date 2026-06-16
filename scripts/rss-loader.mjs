export function load(url, context, nextLoad) {
  if (/\.(jpg|jpeg|png|gif|svg|webp|avif|ico|woff|woff2|ttf|eot)(\?.*)?$/.test(url)) {
    return { format: 'module', shortCircuit: true, source: 'export default "";' };
  }
  return nextLoad(url, context);
}
