import { Avatar, Skeleton, createStyles } from "@mantine/core";
import React, { useState, useEffect } from "react";
import { getDownloadURL, getMetadata, ref } from "firebase/storage";
import { useForceUpdate } from "@mantine/hooks";
import { storage } from "../firebase";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUsuario } from "../utils/usuarioHooks";

const ImagenAvatar = React.forwardRef(
  (
    {
      height,
      width,
      image,
      classes = { avatarObject: "" },
      onLoaded = () => {},
      onImageLoaded = () => {},
      mx="auto"
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
            height={height||"3em"}
            width={width||"3em"}
            mx={mx}
            radius="50%"
            animate={true}
          />
        ) : (
          <Avatar
            radius="50%"
            h={height}
            w={width}
            onLoad={onImageLoaded}
            className={classes.avatarObject}
            src={file}
          />
        )}
      </>
    );
  }
);
export const ImagenAvatarActual = React.forwardRef(
  ({ height, width, classes, onLoaded = () => {} }, refParent) => {
    const [file, setFile] = useState();
    // const { classes, cx } = useStyles();
    const usuario = useSelector(selectUsuario);
    async function loadFotoPerfil() {
      console.log("Renderizando ImagenAvatar");
      let { foto_perfil } = usuario;
      try {
        if (foto_perfil === null) {
          setFile(null);
          throw new Error("La imagen de perfil no esta establecida");
        }
        setFile(undefined);
        let imageRef = ref(storage, foto_perfil);
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
    }, [usuario]);

    React.useImperativeHandle(refParent, () => ({
      loadFotoPerfil,
    }));
    return (
      <>
        {file === undefined ? (
          <Skeleton
            height={height}
            width={width}
            mx="auto"
            radius="50%"
            animate={true}
          />
        ) : (
          <Avatar
            radius="50%"
            h={height}
            w={width}
            className={classes.avatarObject}
            src={file}
          />
        )}
      </>
    );
  }
);
export default ImagenAvatar;
