import { toast } from "react-toastify";

export const showToast = (message, type = "success") => {
  const options = { toastId: message };

  switch (type) {
    case "success":
      toast.success(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    case "loading":
      toast.info(message, options); 
      break;
    default:
      toast(message, options);
      break;
  }
};

export default showToast;
