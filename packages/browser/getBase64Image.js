// get an image blob from url using fetch
const getImageBlob = async function (url) {
  const response = await fetch(url, { mode: 'no-cors' })
  return response.blob()
}

// convert a blob to base64
const blobToBase64 = async function (blob) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = function () {
      const dataUrl = reader.result
      resolve(dataUrl)
    }
    reader.readAsDataURL(blob)
  })
}

// combine the previous two functions to return a base64 encode image from url
export const getBase64Image = async function (url) {
  const blob = await getImageBlob(url)
  const base64 = await blobToBase64(blob)
  return base64
}

// USAGE :
// getBase64Image( 'http://placekitten.com/g/200/300' )
// .then( base64Image=> console.log( base64Image) );
