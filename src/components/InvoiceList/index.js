import { useState, useContext } from "react";
import { UserContext } from "../../context/context";
import "./index.css";

const InvoiceList = ({ invoicesList, setInvoicesList }) => {
  const apiUrl = useContext(UserContext);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(false);

  const viewButtonClicked = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const closeDetailView = () => {
    setSelectedInvoice(null);
  };

  const deleteInvoice = async (invoiceId) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/delete-invoice/${invoiceId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete invoice");
      }

      // Update UI by filtering out the deleted invoice
      setInvoicesList((prevInvoices) =>
        prevInvoices.filter((invoice) => invoice._id !== invoiceId)
      );

      setSelectedInvoice(null); // Close detail view after deletion
    } catch (error) {
      console.error("Error deleting invoice:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Invoices List</h1>

      <table>
        <thead>
          <tr>
            <th>Store Name</th>
            <th>Items Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoicesList.map((each) => (
            <tr key={each._id}>
              <td>{each.storeName}</td>
              <td>{each.itemTotal}</td>
              <td>
                <button onClick={() => viewButtonClicked(each)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedInvoice && (
        <div className="detail-view">
          <h3>Invoice Details</h3>
          <p>Quantity: {selectedInvoice.quantity}</p>
          <p>Regular Price: ${selectedInvoice.regularPrice}</p>
          <p>Deal Price: ${selectedInvoice.dealPrice}</p>
          <p>Item Wise Tax: ${selectedInvoice.itemWiseTax}</p>

          <button onClick={closeDetailView}>Close</button>
          <button
            onClick={() => deleteInvoice(selectedInvoice._id)}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;
