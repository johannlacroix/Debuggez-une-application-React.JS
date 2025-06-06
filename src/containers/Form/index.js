import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import Field, { FIELD_TYPES } from "../../components/Field";
import Select from "../../components/Select";
import Button, { BUTTON_TYPES } from "../../components/Button";

const mockContactApi = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 500);
  });

const Form = ({ onSuccess, onError }) => {
  const [sending, setSending] = useState(false);
  const sendContact = useCallback(
    async (evt) => {
      const formData = new FormData(evt.target);
      const data = {};

      formData.forEach((value, key) => {
        if (data[key]) {
          data[key] = [].concat(data[key], value);
        } else {
          data[key] = value;
        }
      });

      console.log("Valeurs du formulaire :", data);
      evt.preventDefault();
      setSending(true);
      // We try to call mockContactApi
      try {
        // On vérifie que tous les champs nécessaires sont remplis
        if (!data.Nom || !data.Prénom || !data.Email || !data.Message) {
          // Utilisation de la notation par point (dot notation) plutôt que data["Nom"], etc. pour éviter warning eslint
          setSending(false);
          alert("Veuillez remplir tous les champs obligatoires."); // Message d'alerte si un champ est vide
          return; // Empêche l'envoi du formulaire si un champ est manquant
        }

        await mockContactApi();
        setSending(false);
        onSuccess(); // onSuccess n'était pas appellé
      } catch (err) {
        setSending(false);
        onError(err);
      }
    },
    [onSuccess, onError]
  );

  return (
  <form onSubmit={sendContact}>
    <div className="row">
      
      <div className="col">
        
        <Field name="Nom" placeholder="" label="Nom" />
        <Field name="Prénom" placeholder="" label="Prénom" />
        <Select
          name="Type"
          selection={["Personel", "Entreprise"]}
          onChange={() => null}
          label="Personel / Entreprise"
          type="large"
          titleEmpty
        />
        <Field name="Email" placeholder="" label="Email" />
        
        
        <Button type={BUTTON_TYPES.SUBMIT} disabled={sending}>
          {sending ? "En cours" : "Envoyer"}
        </Button>
      </div>


      <div className="col">
        <Field
          name="Message"
          placeholder="message"
          label="Message"
          type={FIELD_TYPES.TEXTAREA}
        />
      </div>
    </div>
  </form>
);

};

Form.propTypes = {
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
};

Form.defaultProps = {
  onError: () => null,
  onSuccess: () => null,
};

export default Form;
