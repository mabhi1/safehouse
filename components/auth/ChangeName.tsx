import Input from "../ui/Input";
import Button from "../ui/Button";
import { updateName } from "@/firebase/firebaseFunctions";
import { showToast } from "@/utils/handleToast";
import { useState } from "react";
import { User } from "firebase/auth";

type Props = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};
const ChangeName = ({ user, setUser }: Props) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, labelName: string) => {
    const value = e.target.value;
    setName(value);
    let label = document.getElementById(labelName);
    if (value.length > 0) {
      label?.classList.add("-translate-y-5", "text-sm", "text-cyan-900");
    } else {
      label?.classList.remove("-translate-y-5", "text-sm", "text-cyan-900");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    if (name.trim() === "") return;
    try {
      await updateName(name);
      showToast("success", "Name updated successfully");
      setUser({ ...user, displayName: name });
      setName("");
    } catch (error) {
      showToast("error", "Error updating name");
    }
    setLoading(false);
  };

  return (
    <div className="w-full flex flex-col gap-3 pt-3 md:pt-5 border-t border-slate-200">
      <div>Change Name</div>
      <form className="flex md:w-fit w-full rounded gap-3" onSubmit={handleSubmit}>
        <div className="flex-1 flex">
          <Input
            value={name}
            onChange={(e) => handleChange(e, "nameLabel")}
            id="name"
            type="name"
            name="name"
            className="peer flex-1 md:w-80 lg:w-96"
            autoComplete="false"
            placeholder="Enter New Name"
          />
        </div>
        {loading ? (
          <Button variant={"disabled"} disabled>
            <span className="hidden md:inline mr-1">Please </span> Wait...
          </Button>
        ) : (
          <Button>Save</Button>
        )}
      </form>
    </div>
  );
};
export default ChangeName;
