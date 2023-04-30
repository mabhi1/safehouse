"use client";
import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "@/utils/handleToast";
import axios from "axios";
import useAuth from "../auth/AuthProvider";
import { encrypt } from "@/utils/encryption";

type Props = {};
const NewCard = (props: Props) => {
  const [type, setType] = useState("credit");
  const [bank, setBank] = useState("");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const queryClient = useQueryClient();
  const currentUser = useAuth();

  const cardMutation = useMutation({
    mutationFn: () => {
      const newExpiry = expiry.split("-").reverse();
      newExpiry[1] = newExpiry[1].substr(2);
      const finalExpiry = newExpiry.join("/");
      return axios.post("/api/cards", {
        type: type,
        bank: bank,
        number: encrypt(number),
        expiry: finalExpiry,
        cvv: encrypt(cvv),
        uid: currentUser?.uid,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["cards"]);
      setNumber("");
      setBank("");
      setExpiry("");
      setCvv("");
      if (cardMutation.isError) showToast("error", "Error creating card");
      else showToast("success", "Card created successfully");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bank.trim() === "" || number.trim() === "" || expiry.trim() === "" || cvv.trim() === "") {
      showToast("error", "Fill all the fields");
      return;
    }
    if (number.length !== 16) {
      showToast("error", "Card Number should be of 16 digits");
      return;
    }
    if (cvv.length < 3 || cvv.length > 4) {
      showToast("error", "CVV should be of 3 to 4 digits");
      return;
    }
    cardMutation.mutate();
  };

  return (
    <form id="form" className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <fieldset className="flex gap-2 items-center">
        <legend>Select a type:</legend>
        <div>
          <Input type="radio" id="credit" name="type" value="credit" defaultChecked={true} onChange={() => setType("credit")} />
          <label htmlFor="credit" className="ml-1">
            Credit
          </label>
        </div>
        <div>
          <Input type="radio" id="debit" name="type" value="debit" onChange={() => setType("debit")} />
          <label htmlFor="debit" className="ml-1">
            Debit
          </label>
        </div>
      </fieldset>
      <div className="flex flex-col">
        <label htmlFor="bank">Bank</label>
        <Input wide={"lg"} id="bank" type="text" name="bank" value={bank} onChange={(e) => setBank(e.target.value)} placeholder="Bank" />
      </div>
      <div className="flex flex-col">
        <label htmlFor="number">Card Number</label>
        <Input
          wide={"lg"}
          id="number"
          type="number"
          name="number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Number"
          maxLength={16}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="expiry">Expiry</label>
        <Input wide={"lg"} id="expiry" type="month" name="expiry" value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="Expiry" />
      </div>
      <div className="flex flex-col">
        <label htmlFor="cvv">CVV</label>
        <Input wide={"lg"} id="cvv" type="number" name="cvv" value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="cvv" maxLength={4} />
      </div>
      {cardMutation.isLoading ? (
        <Button size={"lg"} variant={"disabled"} disabled>
          Please Wait...
        </Button>
      ) : (
        <Button size={"lg"}>Save</Button>
      )}
    </form>
  );
};
export default NewCard;
