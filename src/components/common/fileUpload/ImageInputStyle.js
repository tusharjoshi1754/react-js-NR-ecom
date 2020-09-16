const imageInputStyle = theme => ({
    hidden: { display: "none" },
    container: {
      margin: "auto"
    },
    title: {
      margin: "auto",
      display: "flex",
      justifyContent: "center",
      //fontFamily: 'Roboto Slab',
      //fontWeight:'bold',
    },
    bigAvatar: {
      margin: "auto",
      width: '100%',
      height: '100%',
      borderColor: theme.palette.primary.main,
      borderStyle: "solid",
      borderSize: "1px"
    },
    avatarThumb: {
      maxWidth: "100%",
      maxHeight: "100%"
    },
    primaryBack: {
      background: '#ff8084',
      borderRadius: 0,
      borderColor: '#ff8084',
      padding: 30
    },
    whiteBack: {
      background: "white",
      borderRadius: 0,
    },
    errMsg:{
      float:"left",
      marginTop:10
    },
    removeFiles:{
      textAlign: "right",
      marginTop:10
    },
    errorBack: { background: theme.palette.error.main, padding: 30 }
  });
  export default imageInputStyle;
  