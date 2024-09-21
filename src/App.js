import React, { useState } from "react";
import "./index.css";
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [showAddFriend, setShowAddFrirend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectFriends, setSelectFriends] = useState(null);

  function handaleShowAddFriend() {
    setShowAddFrirend((show) => !show);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFrirend(false);
  }

  function handleSelect(friend) {
    // setSelectFriends(friend);
    setSelectFriends((curr) => (curr?.id === friend.id ? null : friend));
    setShowAddFrirend(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectFriends.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectFriends(null)
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          selectFriends={selectFriends}
          onSelect={handleSelect}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={handaleShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>

      {selectFriends && (
        <FormSplitBill
          setFriends={selectFriends}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendList({ friends, onSelect, selectFriends }) {
  // const friends = initialFriends;
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          frined={friend}
          key={friend.id}
          onSelct={onSelect}
          selectFriends={selectFriends}
        />
      ))}
    </ul>
  );
}

function Friend({ frined, onSelct, selectFriends }) {
  const isSelected = selectFriends?.id === frined.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={frined.image} alt={frined.name} />
      <h3>{frined.name}</h3>

      {frined.balance < 0 && (
        <p className="red">
          You owe {frined.name} {Math.abs(frined.balance)} Rs
        </p>
      )}
      {frined.balance > 0 && (
        <p className="green">
          {frined.name} You owe {Math.abs(frined.balance)} Rs
        </p>
      )}
      {frined.balance === 0 && <p>You and {frined.name} are even</p>}

      <Button onClick={() => onSelct(frined)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;
    const id = crypto.randomUUID;
    const newFriend = {
      id,
      name,
      image,
      balance: 0,
    };

    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧟‍♀️FriendName</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>😵‍💫Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ setFriends, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {setFriends.name}</h2>

      <label>🤑Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>💀Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      <label>🤼‍♂️{setFriends.name}'s expense</label>
      <input type="text" disabled value={paidByFriend} />

      <label>🤔Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friends">{setFriends.name}</option>
      </select>

      <Button>Add</Button>
    </form>
  );
}
