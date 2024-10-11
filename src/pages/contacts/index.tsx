import React, { useEffect, useState, useMemo } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { Card } from 'primereact/card';
import _ from 'lodash';

// application
import { getAuthorized } from '../../libs/auth';
import { collection, db, query, orderBy, getDocs } from '../../libs/firebase';
import { DataTable } from '../../components';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Contacts | Admin Panel | TripHaat', cookies => {
        return null;
    });

const Page = () => {
    const [contacts, setContacts] = useState<any[]>([]);

    // Function to fetch contacts from Firebase
    const fetchContacts = async () => {
        try {
            const q = query(collection(db, 'contacts'), orderBy('timestamp', 'desc'));
            const querySnapshot = await getDocs(q);
            const contactsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setContacts(contactsData);
        } catch (error) {
            console.error('Error fetching contacts:', error);

            // setError('Failed to fetch contact data. Please try again later.');
        }
    };

    // Fetch contacts when the component mounts
    useEffect(() => {
        fetchContacts();
    }, []);

    return useMemo(
        () => (
            <Card title="Contacts" subTitle="List of all contacts from website contact us page">
                {!contacts ? null : <DataTable data={contacts} ignoredColumns={['id', 'timestamp']} />}
            </Card>
        ),
        [contacts]
    );
};

export default Page;
