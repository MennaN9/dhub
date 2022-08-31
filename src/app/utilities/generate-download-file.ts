declare var $: any;

/**
 * generate download file link
 * 
 * 
 * @param name 
 * @param type 
 * @param data 
 */
export function saveFile(name: any, type: any, data) {
  if (data !== null && navigator.msSaveBlob) {
    return navigator.msSaveBlob(new Blob([data], { type: type }), name);
  }

  let a = $("<a style='display: none'/>");
  const url = window.URL.createObjectURL(new Blob([data], { type: type }));

  a.attr("href", url);
  a.attr("download", name);
  $("body").append(a);
  a[0].click();

  window.URL.revokeObjectURL(url);
  a.remove();
}
