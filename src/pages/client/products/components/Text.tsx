import React, { useState } from "react";
import InputFieldCurved from "../../../../components/utils/InputFieldCurved";

const Text = () => {
  const [val, setVal] = useState("");
  return (
    <InputFieldCurved
      label="Expiration (MM/YY)"
      type="text"
      id="payment_expiry"
      name="payment_expiry"
      value={val}
      onChange={(e) => setVal(e.target.value)}
      required
    />
  );
};

export default Text;
