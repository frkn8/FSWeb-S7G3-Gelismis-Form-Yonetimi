import React from "react";
import * as Yup from "yup";
import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import AddForm from "./components/Form";

function App() {
  const [editingMember, setEditingMember] = useState();
  const [editingOrder, setEditingOrder] = useState();
  const [members, setMembers] = useState([
    {
      name: "Elijah Bryant",
      email: "elijah@ran.com",
      pass: "1234",
      term: true,
    },
    {
      name: "Furkan Haltalı",
      email: "furkan@ran.com",
      pass: "2345",
      term: true,
    },
    {
      name: "Giannis Antetokounmpo",
      email: "elijah@ran.com",
      pass: "3456",
      term: false,
    },
  ]);

  function addMember(newMember) {
    console.log("editingOrder", editingOrder);
    if (editingOrder !== undefined) {
      const updatedMembers = [...members];
      updatedMembers.splice(editingOrder, 1, newMember);
      setMembers(updatedMembers);
    } else {
      setMembers([...members, newMember]);
    }
    setEditingOrder();
  }

  function editHelper(memberData, order) {
    setEditingMember(memberData);
    setEditingOrder(order);
  }

  return (
    <div className="App">
      <ul>
        {members.map((member, i) => {
          return (
            <div className="App-add">
              <li key={i}>
                <a className="App-link" href={`emailto:${member.email}`}>
                  {member.name} - Approval:
                  {member.term ? " available" : " absent"} - {member.pass}
                </a>
                <button
                  className="edit-button"
                  onClick={() => editHelper(member, i)}
                >
                  Edit
                </button>
              </li>
            </div>
          );
        })}
      </ul>
      <AddForm addMember={addMember} editMode={editingMember} />
    </div>
  );
}

export default App;
