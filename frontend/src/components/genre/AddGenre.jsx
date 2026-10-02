import React, { useEffect, useState } from "react";
import {
  addNewCategories,
  getOneCategories,
  updateOneCategory,
  deleteCategory,
} from "../../service/category";
import { useNavigate, useParams } from "react-router-dom";
import WarningDel from "../utils/WarningDel";

const AddGenre = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setErr("");
    setLoading(false);
    setSuccess("");
    setName("");
    setDescription("");
    if (id) {
      getOneGenre();
    }
  }, [id]);

  const getOneGenre = async () => {
    try {
      const res = await getOneCategories(id);
      setName(res.data.name);
      setDescription(res.data.description);
    } catch (error) {
      console.log(err);
      setErr(
        err?.response?.data?.message ||
          err.message ||
          "An error occurred while fetching genre."
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === "") {
      alert("Name cannot be empty");
    } else {
      id
        ? updateCategory({ name: name.trim(), description: description.trim() })
        : addCategory({ name: name.trim(), description: description.trim() });
    }
  };

  const updateCategory = (genre) => {
    setLoading(true);
    updateOneCategory(id, genre)
      .then((res) => {
        setSuccess(res.data.name);
      })
      .catch((err) => {
        console.error(err);
        setErr(
          err?.response?.data?.message ||
            err.message ||
            "An error occurred while updating genre."
        );
      })
      .finally(() => setLoading(false));
  };

  const addCategory = (genre) => {
    setLoading(true);
    addNewCategories(genre)
      .then((res) => {
        setSuccess(res.data.name);
        setName("");
        setDescription("");
      })
      .catch((err) => {
        console.error(err);
        setErr(
          err?.response?.data?.message ||
            err.message ||
            "An error occurred while adding genre."
        );
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = () => {
    setLoading(true);
    deleteCategory(id)
      .then((res) => {
        navigate("/");
        alert(res.data);
      })
      .catch((err) => {
        {
          console.log(err);
          setErr(
            err?.response?.data?.message ||
              err.message ||
              "An error occurred while adding genre."
          );
        }
      })
      .finally(() => {
        setLoading(false);
        setWarning(null);
      });
  };

  if (loading) {
    return (
      <div className="text-center mt-8 text-gray-400 absolute top-28 w-full">
        Loading...
      </div>
    );
  }

  if (err) {
    return (
      <div className="text-center mt-8 text-red-600 absolute top-28 w-full">
        Error: {err}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="text-center mt-10 mb-16">
        <h1 className="text-4xl font-extrabold text-orange-600 mb-4">
          {id ? "Edit" : "Add New"} Category
        </h1>
        <hr className="border-t-4 border-orange-600 w-1/5 mx-auto" />
      </div>
      {success && (
        <div className="max-w-lg mx-auto text-center mt-8 text-red-600 font-bold mb-10 bg-amber-50">
          {`Genre: ${success} has been ${id ? "updated" : "added"}`}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-orange-200 p-6 rounded-lg border-2 border-orange-500 shadow-lg space-y-6 text-orange-800"
      >
        <div>
          <label htmlFor="name" className="block text-lg font-semibold">
            Category Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 mt-2 border-2 outline-none border-orange-600 rounded-md"
            placeholder="Enter category name"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-lg font-semibold">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 mt-2 border-2 outline-none border-orange-600 rounded-md"
            placeholder="Enter category description"
            rows="4"
            required
          ></textarea>
        </div>

        <div className="flex justify-center gap-10">
          <button
            type="submit"
            className="bg-orange-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-orange-700 transition-all duration-300 cursor-pointer"
          >
            {id ? "Update" : "Add"} Category
          </button>
          {id && (
            <button
              type="button"
              onClick={() => {
                setWarning(
                  <WarningDel
                    onDelete={handleDelete}
                    onCancel={() => setWarning(null)}
                  />
                );
              }}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-orange-700 transition-all duration-300 cursor-pointer"
            >
              Delete Genre
            </button>
          )}
          {warning}
        </div>
      </form>
    </div>
  );
};

export default AddGenre;
