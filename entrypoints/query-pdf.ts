
export default defineUnlistedScript(() => { })

// TODO: highlight in pdf
document?.querySelector('embed')?.postMessage({type: 'getSelectedText'}, '*')

