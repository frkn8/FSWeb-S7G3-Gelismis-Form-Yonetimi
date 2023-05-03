import React, { useEffect, useState } from "react";
import axios from "axios";
import * as Yup from "yup";

const copyForm = {
  name: "",
  email: "",
  pass: "",
  term: false,
};

let schema = Yup.object().shape({
  name: Yup.string()
    .required("It is mandatory to fill in the name field")
    .min(3, "The name must be at least 3 characters"),
  email: Yup.string()
    .email("Check email field")
    .required("It is mandatory to fill in the email field"),
  pass: Yup.string()
    .min(5, "The password must be at least 5 characters")
    .required("It is mandatory to fill the password field"),
  term: Yup.boolean().oneOf([true], "confirmation is required"),
});

function AddForm(props) {
  const [buttonDisabledMi, setButtonDisabledMi] = useState(true);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    pass: "",
    term: "",
  });
  const [formData, setFormData] = useState(copyForm);
  const [isEditing, setisEditing] = useState(false);

  useEffect(() => {
    schema.isValid(formData).then((valid) => setButtonDisabledMi(!valid));
  }, [formData]);

  useEffect(() => {
    console.log("Edited");
    props.editMode ? setFormData(props.editMode) : setFormData(copyForm);
    props.editMode ? setisEditing(true) : setisEditing(false);
  }, [props.editMode]);

  const handleReset = () => {
    setFormData(copyForm);
    setErrors({
      name: "",
      email: "",
      pass: "",
      term: "",
    });
  };

  function submitHandler(e) {
    e.preventDefault();
    if (buttonDisabledMi) {
      alert("You have to complete the form.");
    } else {
      axios
        .post("https://reqres.in/api/users", formData)
        .then(function (response) {
          console.log(response.data);
          props.addMember(formData);
          setisEditing(false);
          setFormData(copyForm);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  function checkValidation(fieldName, fieldDataValue) {
    Yup.reach(schema, fieldName)
      .validate(fieldDataValue)
      .then(() => {
        setErrors({
          ...errors,
          [fieldName]: "",
        });
      })
      .catch((err) => {
        setErrors({
          ...errors,
          [fieldName]: err.errors[0],
        });
      });
  }

  const changeHandler = (e) => {
    const { value, type, checked, name } = e.target;
    console.log(
      "changeHandler",
      "val",
      value,
      "type",
      type,
      "checked",
      checked
    );
    let fieldData = type === "checkbox" ? checked : value;
    const newformData = {
      ...formData,
      [name]: fieldData,
    };
    setFormData(newformData);
    checkValidation(name, fieldData);
  };

  return (
    <div>
      {isEditing ? <h2>Edit Member</h2> : <h2>Add New Member</h2>}
      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor="name">Name: </label>
          <input
            onChange={(e) => changeHandler(e)}
            type="text"
            name="name"
            value={formData.name}
          />
          <div className="error">
            {errors.name && <span>{errors.name}</span>}
          </div>
        </div>
        <div>
          <label htmlFor="email">Email: </label>
          <input
            onChange={(e) => changeHandler(e)}
            type="email"
            name="email"
            value={formData.email}
          />
          <div className="error">
            {errors.email && <span>{errors.email}</span>}
          </div>
        </div>
        <div>
          <label htmlFor="pass">Password: </label>
          <input
            onChange={(e) => changeHandler(e)}
            type="password"
            name="pass"
            value={formData.pass}
          />

          <div className="error">
            {errors.pass && <span>{errors.pass}</span>}
          </div>
        </div>
        <div>
          <label htmlFor="term">
            <a href="#">Terms of Service</a>
          </label>
          <input
            onChange={(e) => changeHandler(e)}
            type="checkbox"
            name="term"
            checked={formData.term}
          />

          <div className="error">
            {errors.term && <span>{errors.term}</span>}
          </div>
        </div>
        <div className="form-line">
          <button type="reset" onClick={handleReset}>
            Reset Form
          </button>
          <button disabled={buttonDisabledMi} type="submit">
            {isEditing ? "Edit Member" : "Add New Member"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddForm;