import { useState } from "react";

const arrFriend = [
  {
    id: 123,
    img: " https://i.pravatar.cc/48?u=118836",
    name: "Ram",
    balance: -7,
  },
  {
    id: 456,
    img: "https://i.pravatar.cc/48?u=933372",
    name: "Sita",
    balance: 0,
  },
  {
    id: 789,
    img: "https://i.pravatar.cc/48?u=499476",
    name: "Lakhan",
    balance: 18,
  },
];

function FriendList({ friends, handleSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          selectedFriend={selectedFriend}
          handleSelection={handleSelection}
        />
      ))}
    </ul>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFriend({ handleAddFriend }) {
  const [addFriend, setAddFriend] = useState("");
  const [addURL, setAddURL] = useState("https://i.pravatar.cc/48");
  function handleSubmit(e) {
    e.preventDefault();

    if (!addFriend || !addURL) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name: addFriend,
      img: `${addURL}?=${id}`,
      balance: 0,
    };
    handleAddFriend(newFriend);
    setAddFriend("");
    setAddURL("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑‍🤝‍🧑FriendName</label>
      <input
        type="text"
        placeholder="enter name"
        value={addFriend}
        onChange={(e) => setAddFriend(e.target.value)}
      ></input>
      <label>🧔‍♀️Image URL</label>
      <input
        type="text"
        placeholder="enter URL"
        value={addURL}
        onChange={(e) => setAddURL(e.target.value)}
      ></input>
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, handleSplitBill }) {
  const [bill, setBill] = useState("");
  const [userExpense, setUserExpense] = useState("");
  const friendExpense = bill ? bill - userExpense : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !userExpense) return;
    handleSplitBill(whoIsPaying === "user" ? friendExpense : -userExpense);
  }

  return (
    <>
      <form className="form-split-bill" onSubmit={handleSubmit}>
        <h2>Split the bill with {selectedFriend.name}</h2>
        <label>💵bill value:</label>
        <input
          type="text"
          value={bill}
          onChange={(e) => setBill(Number(e.target.value))}
        ></input>
        <label>🧔‍♀️your expense:</label>
        <input
          type="text"
          value={userExpense}
          onChange={(e) =>
            setUserExpense(
              Number(e.target.value) > bill
                ? userExpense
                : Number(e.target.value)
            )
          }
        ></input>
        <label>🧑‍🤝‍🧑{selectedFriend.name}'s' expense:</label>
        <input type="text" disabled value={friendExpense}></input>
        <label>🤑who is paying the bill?</label>
        <select
          value={whoIsPaying}
          onChange={(e) => setWhoIsPaying(e.target.value)}
        >
          <option value="user">you</option>
          <option value="friend">{selectedFriend.name}</option>
        </select>
        <button className="button">Split Bill</button>
      </form>
    </>
  );
}

function Friend({ friend, key, handleSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.img} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe to {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owe to you ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={() => handleSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function App() {
  const [friends, setFriends] = useState(arrFriend);
  const [isFormAddOpen, setFormAddOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleFormOpen() {
    return setFormAddOpen((isFormAddOpen) => !isFormAddOpen);
  }
  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setFormAddOpen(false);
  }

  function handleSelection(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setFormAddOpen(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          handleSelection={handleSelection}
          selectedFriend={selectedFriend}
        />
        {isFormAddOpen && <FormAddFriend handleAddFriend={handleAddFriend} />}

        <Button onClick={handleFormOpen}>
          {isFormAddOpen ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          handleSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

export default App;
