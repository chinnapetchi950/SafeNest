import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createGameType, fetchMessages } from "../features/auth/Game/addGameSlice";

export const useRegisterGameViewModel = () => {
  const dispatch = useDispatch();

  // ============================
  // STATES
  // ============================
  const [gameName, setGameName] = useState("");
  const [sessions, setSessions] = useState([
    { duration: null, price: "", open: false },
  ]);

  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [selectedMessageIds, setSelectedMessageIds] = useState([]);

  const [messageLabel, setMessageLabel] = useState("");
  const [messageList, setMessageList] = useState([]);
const [successModal, setSuccessModal] = useState(false);

  // ============================
  // FETCH MESSAGE LIST
  // ============================
const messages = useSelector((state) => state.createGameType?.messageList || []);

  useEffect(() => {
    dispatch(fetchMessages());
  }, [dispatch]);

  useEffect(() => {
    if (messages && messages.length > 0) {
      const list = messages.map((item) => ({
        id: item.id,
        name: item.name,
      }));
      setMessageList(list);   // ✅ correct list
    }
  }, [messages]);


  // ============================
  // MINUTES: 15 → 60
  // ============================
  const minutes = Array.from({ length: 46 }, (_, i) => {
    const value = i + 1;
    return { label: `${value} Min`, value: value };
  });

  // ============================
  // BUTTON DISABLE LOGIC
  // ============================
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const isNameValid = gameName.trim().length > 0;
    const areSessionsValid = sessions.every(
      (s) => s.duration !== null && s.price.trim().length > 0
    );
  const isMessageValid = selectedMessageIds.length > 0;

    setIsButtonDisabled(!(isNameValid && areSessionsValid && isMessageValid));
  }, [gameName, sessions, selectedMessageIds]);

  // ============================
  // SESSION METHODS
  // ============================
  const addSession = () => {
    if (sessions.length >= 3) return;

    setSessions([
      ...sessions,
      { duration: null, price: "", open: false }, // ✅ MUST INCLUDE open
    ]);
  };

  const deleteSession = (index) => {
    if (sessions.length <= 1) return;
    const updated = [...sessions];
    updated.splice(index, 1);
    setSessions(updated);
  };

  // Dropdown open/close
  const handleOpenChange = (index, isOpen) => {
    const updated = [...sessions];

    // close all dropdowns
    updated.forEach((s) => (s.open = false));

    // open selected one
    updated[index].open = isOpen;

    setSessions(updated);
  };

  const handleDurationChange = (index, value) => {
    const updated = [...sessions];
    updated[index].duration = value;
    setSessions(updated);
  };

  const handlePriceChange = (index, value) => {
    const updated = [...sessions];
    updated[index].price = value;
    setSessions(updated);
  };

  // ============================
  // MESSAGE SELECT
  // ============================
  const handleMessageSelect = (msg) => {
  setSelectedMessageIds((prev) => {
    if (prev.includes(msg.id)) {
      // unselect
      return prev.filter((id) => id !== msg.id);
    } else {
      // select
      return [...prev, msg.id];
    }
  });
};


  // ============================
  // PAYLOAD BUILDER
  // ============================
  const registerGame = async() => {
    const formData = new FormData();
    formData.append("name", gameName);

    sessions.forEach((s, i) => {
      formData.append(`sessions[${i}][price]`, s.price);
      if (s.duration !== null) {
        formData.append(`sessions[${i}][duration]`, s.duration);
      }
    });
 selectedMessageIds.forEach((id) => {
    formData.append("message_ids[]", id);
  });
    //formData.append("message_id", selectedMessageId);
    console.log(formData,'formdata');
    

try {
    const res = await dispatch(createGameType(formData)).unwrap();

    if (res?.success=== true) {
        console.log("llll res");
        
      setSuccessModal(true);   // SHOW SUCCESS MODAL
    } else {
      //Alert.alert("Error", res?.message || "Something went wrong");
    }
  } catch (error) {
    console.log("ERROR:", error);
  }    
  };
const selectedMessageLabel =
  selectedMessageIds.length > 0
    ? messageList
        .filter((m) => selectedMessageIds.includes(m.id))
        .map((m) => m.name)
        .join(', ')
    : '';
  // ============================
  // RETURN VALUES
  // ============================
  return {
    gameName,
    setGameName,

    sessions,
    addSession,
    deleteSession,
    handleDurationChange,
    handlePriceChange,
    handleOpenChange,

    messageList,
    messageLabel: selectedMessageLabel,
    selectedMessageId,
    handleMessageSelect,

    minutes,
    registerGame,
    isButtonDisabled,
    successModal,
    setSuccessModal,
    selectedMessageIds,
    setSelectedMessageIds,
  };
};
