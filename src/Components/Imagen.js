import { Avatar, Image, Skeleton, createStyles } from "@mantine/core";
import React, { useState, useEffect } from "react";
import { getDownloadURL, ref } from "firebase/storage";
import { useForceUpdate } from "@mantine/hooks";
import { storage } from "../firebase";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUsuario } from "../utils/usuarioHooks";

const Imagen = React.forwardRef(
  (
    {
      height,
      heightSkeleton,
      widthSkeleton,
      width,
      image,
      classes = { avatarObject: "" },
      onLoaded = () => {},
      onImageLoaded = () => {},
      fit = "cover",
    },
    refParent
  ) => {
    const [file, setFile] = useState();
    // const { classes, cx } = useStyles();
    async function loadFotoPerfil() {
      console.log("Renderizando ImagenAvatar");
      try {
        if (image === null) {
          setFile(null);
          throw new Error("Imagen no establecida");
        }
        setFile(undefined);
        let imageRef = ref(storage, image);
        let reference = await getDownloadURL(imageRef);
        //   await axios.get(reference)
        setFile(reference);
      } catch (err) {
        console.log(err);
        setFile(null);
      }
      onLoaded();
      // forceLoad();
    }
    useEffect(() => {
      console.log("Cambie la foto");
      loadFotoPerfil();
    }, []);

    React.useImperativeHandle(refParent, () => ({
      loadFotoPerfil,
    }));
    return (
      <>
        {file === undefined ? (
          <Skeleton
            height={heightSkeleton || "100%"}
            width={widthSkeleton || "100%"}
            animate={true}
          />
        ) : (
          <Image
            src={file}
            height={height}
            onLoad={onImageLoaded}
            fit={fit}
            width={width}
            withPlaceholder
          />
        )}
      </>
    );
  }
);
export default Imagen;
