import { useState } from "react";

const InputBox = (name, id, value, icon) => {
  const [passwordvisible, setPasswordvisible] = useState(false);

  const handleClick = () => {
    setPasswordvisible(!passwordvisible);
  };

  return (
    <div className="relative w-[100%] mb-4 ">
      <input
        name={name.name}
        type={
          name.type == "password"
            ? passwordvisible
              ? "text"
              : "password"
            : name.type
        }
        placeholder={name.placeholder}
        defaultValue={value}
        id={id}
        className="input-box"
      />
      <i className={name.icon + " input-icon "}></i>

      {name.type == "password" ? (
        <i
          className={
            "fi fi-rr-eye" +
            (!passwordvisible ? "-crossed" : "") +
            " input-icon left-[auto] right-4 cursor-pointer"
          }
          onClick={handleClick}
        ></i>
      ) : (
        ""
      )}
    </div>
  );
};
export default InputBox;
