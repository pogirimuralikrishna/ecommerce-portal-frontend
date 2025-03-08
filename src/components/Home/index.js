import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/context";
import Cookies from 'js-cookie'; 
import InvoiceList from "../InvoiceList";

const Home = () => {
  const [invoices, setInvoices] = useState([]);
  const apiUrl = useContext(UserContext);
  const jwtToken = Cookies.get("jwtToken");

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch(`${apiUrl}/all-invoices`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const invoicesData = await response.json();
        setInvoices(invoicesData);
        console.log(invoicesData)
      } catch (error) {
        console.error("Error fetching invoices:", error);
        // display error message to user
      }
    };

    fetchInvoices();
  }, []); 

  return (
    <div>
      
      <InvoiceList invoicesList = {invoices}/>
    </div>
  );
};

export default Home;