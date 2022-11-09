import { MessageBuilder } from '../shared/message'

const messageBuilder = new MessageBuilder()

const fetchImg = async (ctx) => {
  try {
    const response = await fetch('https://devpika.github.io/favicon.png')
    // let received = typeof(response.body)
    // function str2ab(str) {
    //   var buf = new ArrayBuffer(str.length); // 2 bytes for each char
    //   var bufView = new Uint8Array(buf);
    //   for (var i = 0, strLen = str.length; i < strLen; i++) {
    //     bufView[i] = str.charCodeAt(i);
    //   }
    //   return buf;
    // }
    // let finalArray = str2ab(response.body)
    ctx.response({
      data: { result: response.body },
    })

  } catch (error) {
    ctx.response({
      data: { result: 'ERROR' },
    })
  }
}

const fetchImgTest = async (ctx) => {
  try {
    const response = await fetch('https://devpika.github.io/assets/images/jigree.png')
    let received = typeof(response.body)
    function str2ab(str) {
      var buf = new ArrayBuffer(str.length);
      var bufView = new Uint8Array(buf);
      for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
      }
      return buf;
    }
    let finalArray = str2ab(response.body)
    received = typeof(finalArray)


    ctx.response({
      data: {result: {
        // text: response.body.toString() + ";" + typeof(response.body)+";" + JSON.parse(response.body).fact
        text: received
      }}
    })
  } catch (error) {
    ctx.response({
      data: {result: {
        text: error.toString()
      }}
    })
  }
}

AppSideService({
  onInit() {
    messageBuilder.listen(() => {})

    messageBuilder.on('request', (ctx) => {
      const jsonRpc = messageBuilder.buf2Json(ctx.request.payload)
      if (jsonRpc.method === 'GET_DATA') {
        return fetchImg(ctx)
      }
    })
  },

  onRun() {
  },

  onDestroy() {
  }
})
