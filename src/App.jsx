import React, { useState, useEffect } from "react";
import { FaRegEdit, FaListUl } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import "./App.css";

const Header = ({ onOpenModal, onLogout }) => (
  <div className="header">
    <h1>Lista de Usuários</h1>
    <aside>
      <button id="new" onClick={onOpenModal}>
        Incluir Usuário
      </button>
      <button id="sair" onClick={onLogout}>
        Sair
      </button>
    </aside>
  </div>
);

const Table = ({ data, onEdit, onDelete }) => (
  <div className="divTable">
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Senha</th>
          <th className="acao">Ver</th>
          <th className="acao">Editar</th>
          <th className="acao">Excluir</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.nome}</td>
            <td>{"****"}</td>
            <td className="acao">
              <button
                className="button"
                onClick={() => alert(`Nome: ${item.nome}\nSenha: ${item.senha}`)}
              >
                <FaListUl />
              </button>
            </td>
            <td className="acao">
              <button className="button" onClick={() => onEdit(index)}>
                <FaRegEdit />
              </button>
            </td>
            <td className="acao">
              <button className="button" onClick={() => onDelete(index)}>
                <MdDeleteForever />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Modal = ({ isOpen, onClose, onSave, initialData }) => {
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");

  useEffect(() => {
    if (initialData) {
      setNome(initialData.nome);
      setSenha(initialData.senha);
    } else {
      setNome("");
      setSenha("");
    }
  }, [initialData]);

  const handleSave = (e) => {
    e.preventDefault();
    onSave({ nome, senha });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h1>{initialData ? "Editar Usuário" : "Cadastrar Usuário"} </h1>
        <form onSubmit={handleSave}>
          <label>Nome:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <label>Senha:</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <button type="submit">Salvar</button>
        </form>
      </div>
    </div>
  );
};

const Login = ({ onLogin, onRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const savedUsers = JSON.parse(localStorage.getItem("dbuso")) || [];
    const user = savedUsers.find(
      (u) => u.nome === username && u.senha === password
    );

    if (user) {
      onLogin();
    } else {
      alert("Credenciais inválidas!");
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <label>
          Nome:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Senha:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Entrar</button>
        <button onClick={onRegister}>Cadastrar</button>
      </form>
      
    </div>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("dbuso")) || [];
    setUsuarios(savedData);
  }, []);

  useEffect(() => {
    localStorage.setItem("dbuso", JSON.stringify(usuarios));
  }, [usuarios]);

  const handleOpenModal = (index = null) => {
    setEditingIndex(index);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingIndex(null);
    setModalOpen(false);
  };

  const handleSave = (data) => {
    if (editingIndex !== null) {
      const updated = [...usuarios];
      updated[editingIndex] = data;
      setUsuarios(updated);
    } else {
      setUsuarios([...usuarios, data]);
    }
    handleCloseModal();
  };

  const handleDelete = (index) => {
    const updated = usuarios.filter((_, i) => i !== index);
    setUsuarios(updated);
  };

  const handleLogout = () => setIsLoggedIn(false);

  if (!isLoggedIn) {
    return (
      <>
        <Login
          onLogin={() => setIsLoggedIn(true)}
          onRegister={() => setModalOpen(true)}
        />
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      </>
    );
  }

  return (
    <div className="container">
      <Header onOpenModal={() => handleOpenModal()} onLogout={handleLogout} />
      <Table
        data={usuarios}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        initialData={editingIndex !== null ? usuarios[editingIndex] : null}
      />
    </div>
  );
};

export default App;
