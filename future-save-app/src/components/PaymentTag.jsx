import React from 'react'
import Defaulted from "../assets/defaulted.svg"
import Weekend from "../assets/weekend.svg"
import Advanced from "../assets/advanced.svg"
import Timely from "../assets/timely.svg"

const PaymentTag = ({type}) => {
  return (
    <div>
     {
    type === "advancePayment" && <img src={Advanced} alt="" />
    }
     {
    type === "timelyPayment" && <img src={Timely} alt="" />
    }
      {
    type === "weekendPayment" && <img src={Weekend} alt="" />
    }
      {
    type === "defaultedPayment" && <img src={Defaulted} alt="" />
    }
    </div>
  )
}

export default PaymentTag