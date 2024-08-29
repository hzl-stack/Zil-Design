/**
 * 前端导出pdf
 */
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';

// 打印类型
const PRINT_TYPE = {
  DOWNLOAD: 'download',
  CURRENT_PRINT: 'currentPrint',
  NEW_PAGE_PRINT: 'newPagePrint',
};

export function toBlob(base64Data) {
  let byteString = base64Data;
  if (base64Data.split(',')[0].indexOf('base64') >= 0) {
    byteString = window.atob(base64Data.split(',')[1]); // base64 解码
  } else {
    byteString = decodeURI(base64Data.split(',')[1]);
  }
  // 获取文件类型
  const mimeString = base64Data.split(';')[0].split(':')[1]; // mime类型

  // ArrayBuffer 对象用来表示通用的、固定长度的原始二进制数据缓冲区
  // let arrayBuffer = new ArrayBuffer(byteString.length) // 创建缓冲数组
  // let uintArr = new Uint8Array(arrayBuffer) // 创建视图

  const uintArr = new Uint8Array(byteString.length); // 创建视图

  for (let i = 0; i < byteString.length; i += 1) {
    uintArr[i] = byteString.charCodeAt(i);
  }
  // 生成blob
  const blob = new Blob([uintArr], {
    type: mimeString,
  });
  // 使用 Blob 创建一个指向类型化数组的URL, URL.createObjectURL是new Blob文件的方法,可以生成一个普通的url,可以直接使用,比如用在img.src上
  return blob;
}
/**
 * 生成pdf、pdf打印
 * @param {*} ele  页面解析后的dom
 * @param {*} printParams 打印配置，内部配置参数如下
 * @param {*} title  文件名称
 * @param {*} type 打印类型
 * @param {*} offset  边距
 */
export const printPreviewPDF = (ele, printParams) => {
  const {
    title,
    type,
    offset = 15,
    iframDom,
    scale,
    approveTr = true,
  } = printParams;
  const newDom = ele.cloneNode(true);
  if (!approveTr) {
    newDom.getElementsByClassName('approveTr')?.forEach((el) => {
      el.style.display = 'none';
    });
  }
  newDom.style.position = 'fixed';
  newDom.style.top = 999999;
  document.body.appendChild(newDom);
  html2canvas(newDom, {
    dpi: 300,
    scale: scale || 2,
    useCORS: true,
    logging: true,
    allowTaint: true,
  }).then((canvas) => {
    const contentWidth = canvas.width;
    const contentHeight = canvas.height;

    const w = 595.28 - offset * 2;
    const h = 841.89 - offset * 2;
    // 一页pdf显示html页面生成的canvas高度;
    const pageHeight = (contentWidth / w) * h;
    // 未生成pdf的html页面高度
    let remainHeight = contentHeight;
    // pdf页面偏移
    let position = 0;
    // html页面生成的canvas在pdf中图片的宽高(a4纸的尺寸[595.28,841.89])
    const imgWidth = w;
    const imgHeight = (w / contentWidth) * contentHeight;

    const pageData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new JsPDF('', 'pt', 'a4');

    // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
    // 当内容未超过pdf一页显示的范围，无需分页
    if (remainHeight < pageHeight) {
      pdf.addImage(pageData, 'JPEG', offset, offset, imgWidth, imgHeight);
    } else {
      while (remainHeight > 0) {
        pdf.addImage(pageData, 'JPEG', offset, position, imgWidth, imgHeight);
        remainHeight -= pageHeight;
        position -= 841.89;
        // 避免添加空白页
        if (remainHeight > 0) {
          pdf.addPage();
        }
      }
    }
    if (type === PRINT_TYPE.CURRENT_PRINT) {
      pdf.autoPrint();
      iframDom.src = pdf.output('datauristring'); // 在iframe中显示，实现当前页面打印
      // 打印
    } else if (type === PRINT_TYPE.DOWNLOAD) {
      // 下载
      pdf.save(`${title}.pdf`);
    } else {
      const link = window.URL.createObjectURL(
        toBlob(pdf.output('datauristring')),
      );
      const myWindow = window.open(link);
      myWindow?.print();
    }
    newDom.remove();
  });
};

// 打印预览，html直接生成pdf打印
export const printOrPreviewPDF = async (ele, printParams) => {
  const { approveTr, isPrint, title } = printParams || {};
  const newDom = ele.cloneNode(true);
  if (!approveTr) {
    newDom.getElementsByClassName('approveTr')?.forEach((el) => {
      el.style.display = 'none';
    });
  }
  newDom.style.position = 'fixed';
  newDom.style.top = 999999;
  document.body.appendChild(newDom);
  const doc = new JsPDF('', 'pt', 'a4');
  await doc.html(ele, {
    callback: (pdf) => {
      if (isPrint) {
        pdf.autoPrint();
        pdf.output('dataurlnewwindow');
      } else {
        pdf.save(`${title || '生成pdf测试'}.pdf`);
      }
    },
    margin: [30, 30, 30, 30],
  });
  newDom.remove();
};
