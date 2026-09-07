import Swal from "sweetalert2";

export const showSuccessAlert = (title: string, text: string) => {
  return Swal.fire({
    title,
    text,
    icon: "success",
    confirmButtonColor: "#09090b",
    customClass: {
      popup: "rounded-3xl shadow-2xl border border-neutral-100 font-sans",
      confirmButton: "px-6 py-2.5 rounded-xl text-xs font-bold bg-neutral-950 text-white shadow-md",
    },
  });
};

export const showErrorAlert = (title: string, text: string) => {
  return Swal.fire({
    title,
    text,
    icon: "error",
    confirmButtonColor: "#e11d48",
    customClass: {
      popup: "rounded-3xl shadow-2xl border border-neutral-100 font-sans",
      confirmButton: "px-6 py-2.5 rounded-xl text-xs font-bold bg-rose-600 text-white shadow-md",
    },
  });
};

export const showConfirmAlert = async (title: string, text: string, confirmButtonText: string = "Yes, proceed") => {
  return await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#09090b",
    cancelButtonColor: "#737373",
    confirmButtonText,
    cancelButtonText: "Cancel",
    customClass: {
      popup: "rounded-3xl shadow-2xl border border-neutral-100 font-sans",
      confirmButton: "px-5 py-2.5 rounded-xl text-xs font-bold bg-neutral-950 text-white shadow-md",
      cancelButton: "px-5 py-2.5 rounded-xl text-xs font-bold bg-stone-200 text-neutral-800",
    },
  });
};
