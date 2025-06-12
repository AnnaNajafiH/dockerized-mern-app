import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import ItemList from './components/ItemList';
import ItemForm from './components/ItemForm';
import Footer from './components/Footer';
import { ItemProvider } from './context/ItemContext';
import './App.css';

function App() {
  return (
    <Router>
      <ItemProvider>
        <div className="App">
          <Header />
          <main className="py-4 container">
            <Routes>
              <Route path="/" element={<ItemList />} />
              <Route path="/items/new" element={<ItemForm />} />
              <Route path="/items/edit/:id" element={<ItemForm />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </ItemProvider>
    </Router>
  );
}

export default App;