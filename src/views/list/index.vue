<template>
  <div>
    <el-upload
      class="upload-demo"
      multiple
      action=""
      :limit="2"
      :file-list="fileList"
      :http-request="upload"
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
    <video
      src="http://127.0.0.1:7001/public/videos/丽水调度.mp4"
      autoplay
      controls
      height="400"
      preload="none"
    ></video>
  </div>
</template>
<script>
  import axios from "axios";
  export default {
    data() {
      return {
        fileList: [],
        id: 0,
        isEdit: true,
      };
    },
    methods: {
      upload(param) {
        this.id++;
        if (this.id === 2) {
          param.file.type.includes("video")
            ? (this.fileList[0] = param.file)
            : (this.fileList[1] = param.file);
          fn.call(this, this.fileList);
        } else {
          param.file.type.includes("video")
            ? (this.fileList[0] = param.file)
            : (this.fileList[1] = param.file);
        }
        function fn() {
          const formData = new FormData();

          formData.append("file", this.fileList[0]);
          formData.append("file", this.fileList[1]);
          formData.append("title", this.isEdit? "改名了老表":"丽水调度");
          formData.append("description", this.isEdit?"你也改掉了":"丽水调度描述~~~");
          const url = this.isEdit
            ? "http://127.0.0.1:7001/api/v1/video/3"
            : "http://127.0.0.1:7001/api/v1/video";
          axios
            .post(url, formData, {
              headers: {
                Authorization:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTY5MTQ4Mjg5MywiZXhwIjoxNzc3ODgyODkzfQ.Y4kMUcd7lJIiqtB4hR0hODtf8vi8esZ-32pGXsWLRjQ",
              },
            })
            .then((data) => {
              console.log("上传图片成功");
            })
            .catch((response) => {
              console.log(response, "图片上传失败");
            });
        }
      },
    },
  };
</script>