import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Upload, UploadProps, message, Image } from "antd";
import { RcFile, UploadChangeParam, UploadFile } from "antd/es/upload";
import { useState } from "react";
import { connect } from "@/lib/Axios";

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

type Props = {
  url: string;
  callback?: (uploadFile: UploadFile) => void;
};

export default function UserAvatar(props: Readonly<Props>) {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [showPreview, setShowPreview] = useState(false);
  const [list, setList] = useState<UploadFile[]>([]);

  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>,
  ) => {
    setLoading(info.file.status == "uploading");
    if (info.file.status == "done") {
      info.fileList.forEach((i) => (i.url = i.response[0].url));
    }
    setList(info.fileList);
  };

  const onPreview: UploadProps["onPreview"] = (file) => {
    setImageUrl(file.url);
    setShowPreview(true);
  };

  const uploadButton =
    list.length != 1 ? (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    ) : undefined;
  return (
    <>
      <Image
        hidden
        alt="preview"
        preview={{
          src: connect.defaults.baseURL ?? "" + imageUrl,
          visible: showPreview,
          onVisibleChange: (e) => {
            if (!e) setShowPreview(false);
          },
        }}
      />
      <Upload
        name="file"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={true}
        action={[connect.defaults.baseURL, props.url].join("/")}
        headers={Object.fromEntries(
          Object.entries(connect.defaults.headers).map(
            (i) => [i[0], i[1]?.toString()] as [string, string],
          ),
        )}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        onPreview={onPreview}
      >
        {uploadButton}
      </Upload>
    </>
  );
}
