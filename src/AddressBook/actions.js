import { searchContactsActions } from './SearchContacts';
import { contactDetailsActions } from './ContactDetails';

// TODO: Something is missing here //Fixed
export const updateSearchPhrase = (phrase) => (dispatch, getState, { httpApi }) => {
    dispatch(searchContactsActions.updateSearchPhrase(phrase));

    setTimeout(
        () =>
            httpApi
                .getFirst5MatchingContacts({ namePart: phrase })
                ?.then(({ data }) => {
                    const matchingContacts = data.map((contact) => ({
                        id: contact.id,
                        value: contact.name,
                    }));
                    // TODO something is wrong here //Fixed
                    dispatch(searchContactsActions.updateSearchPhraseSuccess(matchingContacts));
                })
                .catch(() => {
                    // TODO something is missing here //Fixed
                    dispatch(searchContactsActions.updateSearchPhraseFailure());
                }),
        300
    );
};

export const selectMatchingContact = (selectedMatchingContact) => (dispatch, getState, { httpApi, dataCache }) => {
    const getContactDetails = ({ id }) => {
        // TODO: Something is missing here //Fixed
        if (dataCache.get(id)) {
            return new Promise((resolve, reject) => {
                dataCache.get(id)
                    ? resolve(dataCache.get(id))
                    : reject(new Error("Whoops!"));
            });
        }

        return httpApi
            .getContact({ contactId: id })
            .then(({ data }) => {
                return {
                id: data.id,
                name: data.name,
                phone: data.phone,
                addressLines: data.addressLines,
            }});
    };

    console.log("selectedMatchingContact", selectedMatchingContact)

    dispatch(searchContactsActions.selectMatchingContact(selectedMatchingContact));

    // TODO: Something is missing here //Fixed

    dispatch(contactDetailsActions.fetchContactDetails());

    getContactDetails({ id: selectedMatchingContact.id })
        .then((contactDetails) => {
            dataCache.set(
                contactDetails.id,
                contactDetails,
            )
            dispatch(contactDetailsActions.fetchContactDetailsSuccess(contactDetails));
        })
        .catch(() => {
            dispatch(contactDetailsActions.fetchContactDetailsFailure());
        });
};
