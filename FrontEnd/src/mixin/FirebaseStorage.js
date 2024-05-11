import firebase from "firebase/compat/app";
// import { fileStorage } from "../main";
import "firebase/compat/storage";
export const FirebaseStorageMixin = {
  data() {
    return {
      imageData: null,
      uploadValue: 0,
      picture: null,
      storageRef: null,
      url: null,
    };
  },
  methods: {
    deleteFirebase(refUrl) {
      firebase
        .storage()
        .ref(refUrl)
        .delete()
        .then((res) => {
          console.log("deleted");
        })
        .catch((e) => {
          console.log("e", e);
        });
      this.picture = null;
      this.uploadValue = 0;
    },
    handleImageFile(event, refUrl) {
      this.uploadValue = 0;
      this.picture = null;
      this.imageData = event;
      this.onUpload(refUrl);
    },
    onUpload(refUrl) {
      this.picture = null;
      this.storageRef = firebase.storage().ref(refUrl).put(this.imageData);
      this.storageRef.on(
        `state_changed`,
        (snapshot) => {
          this.uploadValue =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          console.log(error.message);
        },
        () => {
          this.uploadValue = 100;
          this.storageRef.snapshot.ref.getDownloadURL().then((url) => {
            console.log(url);
            this.picture = url;
            if (this.imageData === null) {
              this.picture = null;
              this.uploadValue = 0;
            }
            this.execute();
          });
        }
      );
    },
    uploadToFireBase(image, path) {
      const storage = firebase.storage();
      return new Promise((resolve, reject) => {
        this.storageRef = firebase.storage().ref(path).put(image);
        this.storageRef.on(
          `state_changed`,
          (snapshot) => {},
          (error) => {
            console.log(error.message);
            reject(error);
          },
          () => {
            storage
              .ref("class")
              .child(path.replace("class", ""))
              .getDownloadURL()
              .then((url) => {
                resolve(url);
              });
          }
        );
      });
    },
    getFileName(path) {
      const storage = firebase.storage().refFromURL(path);

      return storage.name;
    },
    execute() {
      console.log("mixin");
    },
  },
};
