import {
  DEFAULT_COLOR,
  DEFAULT_COLOR_TRANSPARENT,
} from "../utils/config/constants";
import { DEVICE_WIDTH } from "../utils/config/device";

const logger = DeviceRuntimeCore.HmLogger.getLogger("fetch_api");
const { messageBuilder } = getApp()._options.globalData

Page({
  state: {},
  build() {
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: (DEVICE_WIDTH - px(400)) / 2,
      y: px(260),
      w: px(400),
      h: px(100),
      text_size: px(36),
      radius: px(12),
      normal_color: DEFAULT_COLOR,
      press_color: DEFAULT_COLOR_TRANSPARENT,
      text: "Fetch Data",
      click_func: (button_widget) => {
        logger.log("click button");
        this.fetchData();
      },
    });
  },
  fetchData() {
    messageBuilder.request({
      method: "GET_DATA",
    })
    .then(data => {
      logger.log('receive data')
      const { result = {} } = data

      // Seems to try to print a PNG in the simulator logs
      // Does this mean data is getting through fine?
      logger.log(result)
      logger.log(typeof(result))
      function str2ab(str) {
        var buf = new ArrayBuffer(str.length); // 2 bytes for each char
        var bufView = new Uint8Array(buf);
        for (var i = 0, strLen = str.length; i < strLen; i++) {
          bufView[i] = str.charCodeAt(i);
        }
        return bufView;
      }
      let finalArray = str2ab(result)
      logger.log(finalArray.length)

      const file = hmFS.open('bg2.png', hmFS.O_RDWR | hmFS.O_CREAT)
      const fileWriteResult = hmFS.write(file, finalArray.buffer, 0, finalArray.length)
      logger.log(fileWriteResult)

      const [fs_stat, err] = hmFS.stat('bg2.png')
      // const [fs_stat, err] = hmFS.stat_asset('../data')
      logger.log(`stat: ${fs_stat}; error: ${err}`)

      // TODO
      // Confirmed with dev team, no way to access /data in widgets yet 
      if (err === 0) {
        const { size, mtime } = fs_stat
        logger.log(`size: ${size}; mtime: ${mtime}`)
        const img = hmUI.createWidget(hmUI.widget.IMG, {
          x: 20,
          y: 20,
          src: '../data/bg2.png'
        })
      } else {
        logger.log('err:', err)
      }
    })
  },
});
