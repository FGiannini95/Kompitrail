import React from "react";
import { useForm } from "react-hook-form";

export const Register = () => {
  const {
    register,
    //the handleSubmit function from react-hook-form will do some work behind the scene for us, like the valdiation and the prevent default
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(data);
    } catch (error) {
      setError("root", {
        message: "This email is already taken",
      });
    }
  };

  return (
    <form
      className="gap-2"
      style={{ paddingTop: "80px", display: "flex", flexDirection: "column" }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <input
        {...register("name", {
          required: "Nombre obligatorio",
          minLength: {
            value: 2,
            message: "El nombre debe contener 2 carácteres",
          },
        })}
        type="password"
        placeholder="Nombre"
      />
      {errors.name && <div className="text-red-500">{errors.name.message}</div>}
      <input
        {...register("lastName", {
          required: "Apellidos obligatorios",
          minLength: {
            value: 8,
            message: "Los apellidos debe contener almenos 2 carácteres",
          },
        })}
        type="text"
        placeholder="Apellidos"
      />
      {errors.lastName && (
        <div className="text-red-500">{errors.lastName.message}</div>
      )}
      <input
        {...register("email", {
          required: "Correo obligatorio",
          //If there is an error, it can return a string, otherwise always a boolean
          validate: (value) => {
            if (!value.includes("@")) {
              return "El correo debe incluir @"; //TODO: add more validation
            }
            return true;
          },
        })}
        type="text"
        placeholder="Correo"
      />
      {errors.email && (
        <div className="text-red-500">{errors.email.message}</div>
      )}
      <input
        {...register("password", {
          required: "Contraseña obligatoria",
          minLength: {
            value: 8,
            message: "La contraseña debe contener 8 carácteres",
          },
        })}
        type="password"
        placeholder="Contraseña"
      />
      {errors.password && (
        <div className="text-red-500">{errors.password.message}</div>
      )}
      <button disabled={isSubmitting} type="submit">
        {isSubmitting ? "Cargando..." : "Crear"}
      </button>
      <button type="button">Cancelar</button>
      {errors.root && <div className="text-red-500">{errors.root.message}</div>}
    </form>
  );
};
