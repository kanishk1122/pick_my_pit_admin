'use client'
import React, { createContext, useContext } from 'react';
import Swal from 'sweetalert2';

// Create the context
const SweetAlertContext = createContext(null);

export const SwalProvider = ({ children }) => {
    // Create the configured instance
    // Note: Swal.mixin returns a new class that extends Swal
    const swalInstance = Swal.mixin({
        customClass: {
            container: 'swal-container',       
            popup: 'swal-popup',               
            title: 'swal-title',               
            htmlContainer: 'swal-content',     
            confirmButton: 'swal-button',      
            cancelButton: 'swal-cancelbutton', 
            actions: 'swal2-actions',          
            icon: 'swal2-icon'                 
        },
        buttonsStyling: false, 
        reverseButtons: true,  
        focusConfirm: false,   
    });

    return (
        <SweetAlertContext.Provider value={swalInstance}>
            {children}
        </SweetAlertContext.Provider>
    );
};

// Custom Hook
export const useSwal = () => {
    const context = useContext(SweetAlertContext);
    
    if (!context) {
        throw new Error('useSwal must be used within a SwalProvider');
    }
    
    return context;
};