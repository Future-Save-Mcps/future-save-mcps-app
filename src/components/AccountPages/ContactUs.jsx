import { Box, Modal, Typography } from "@mui/material";
import React, { useState } from "react";
import FormFieldComp from "../form/FormFieldComp";
import { useForm } from "react-hook-form";
import Bg from "../../assets/bgtwo.svg";
import LinkedIn from "../../assets/linkedin.svg";
import Instagram from "../../assets/instagram.svg";
import Twitter from "../../assets/twittet.svg";
import Facebook from "../../assets/facebook.svg";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95vw",
  bgcolor: "background.paper",
  border: "none",
  outline: "none",
  px: 4,
  maxWidth: "530px",
  borderRadius: "20px",
};

const ContactUs = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };
  return (
    <>
      <div>
        <div className="flex justify-between items-center">
          <div className="font-[600] text-[22px]">Contact Us</div>
        </div>

        <div className="mt-8">
          <div
            style={{
              backgroundImage: `url(${Bg})`,
              backgroundSize: "cover",
              // backgroundRepeat: "repeat",
              backgroundPosition: "center",
            }}
            className="flex text-white bg-[#041F62] w-[100%]   rounded-xl  justify-center p-4 flex-wrap "
          >
            <div className="flex flex-col  flex-1 items-center justify-center gap-1">
              <h3 className="font-bold">Email</h3>
              <p>futuresavempcs@gmail.com</p>
            </div>
            <div className="flex flex-col  flex-1 items-center justify-center gap-1">
              <h3 className="font-bold">Phone Number</h3>
              <p>8263363525</p>
            </div>
          </div>
          <div className="flex gap-12 justify-center mt-14 flex-wrap">
            <div className=" w-[80vw] max-w-[280px] border rounded-lg p-4 flex items-center gap-8 text-[18px]">
              <img src={LinkedIn} alt="" /> LinkedIn
            </div>
            <div className=" w-[80vw] max-w-[280px] border rounded-lg p-4 flex items-center gap-8 text-[18px]">
              <img src={Instagram} alt="" />
              Instagram
            </div>
            <div className=" w-[80vw] max-w-[280px] border rounded-lg p-4 flex items-center gap-8 text-[18px]">
              <img src={Twitter} alt="" />
              Twitter
            </div>
            <div className=" w-[80vw] max-w-[280px] border rounded-lg p-4 flex items-center gap-8 text-[18px]">
              <img src={Facebook} alt="" />
              Facebook
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
