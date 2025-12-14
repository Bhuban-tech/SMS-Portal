
export const API_BASE_URL = "http://192.168.110.233:8080"; 
export const ENDPOINTS = {
  //auth
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",

  //admins
  GET_ADMIN: (id) => `/api/admins/${id}`,
  UPDATE_ADMIN: (id) => `/api/admins/update/${id}`,


  //individual contacts
  CREATE_CONTACT: "/api/contacts/add",
  UPDATE_CONTACT: (id) => `/api/contacts/update/${id}`,
  DELETE_CONTACT: (id) => `/api/contacts/delete/${id}`,
  GET_ALL_CONTACTS: "/api/contacts/all",


  //groups
  GET_ALL_GROUPS: "/api/groups/all",
  CREATE_GROUP: "/api/groups/create",
  UPDATE_GROUP: (id) => `/api/groups/update/${id}`,
  DELETE_GROUP: (id) => `/api/groups/delete/${id}`,
  CONTACTS_ADD_TO_GROUP: (id) => `/api/groups/${id}/contacts`,
  GET_GROUP_CONTACTS: (id) => `/api/groups/${id}`,
  BULK_ADD_CONTACTS_TO_GROUP: (groupId) => `/api/groups/${groupId}/contacts/bulk`,

  //messages


  

};
