import saveAs from "file-saver";

export async function saveFile(
  promise: () => Promise<any>,
  fileType: string,
  fileName: string,
  {
    onSuccess,
    onError,
  }: {
    onSuccess?: (fileName: string) => void;
    onError?: (message: string) => any;
  }
) {
  let type;
  let ext;

  switch (fileType) {
    case "excel":
      type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      ext = ".xlsx";
      break;
    case "zip":
      type = "application/zip";
      ext = ".zip";
      break;
    case "csv":
      type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      ext = ".csv";
      break;
    default:
      break;
  }

  try {
    let res = await promise();
    let blob = new Blob([res], {
      type,
    });
    saveAs(blob, `${fileName}${ext}`);
    if (onSuccess) onSuccess(`${fileName}${ext}`);
  } catch (err) {
    console.error(err);
    if (onError) onError(`${JSON.parse(await err.text()).message}`);
  }
}
