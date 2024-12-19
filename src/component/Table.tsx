interface RowDataInterface {
        
            title: string
            place_of_origin: string
            artist_display: string
            inscriptions: any
            date_start: number
            date_end: number
            index: number
           isChecked: boolean
        
}


import React, { useState, useRef } from "react";
import { useApi } from "../hooks/usePaginatedApi";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from "primereact/paginator";
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from "primereact/button";



const Table: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<number>(1); // current page
    const { totalRecords, data, error, loading, handleCheck, handleRemove } = useApi(currentPage); // Pass 1-based 

    const [inputValue, setInputValue] = useState<number | ''>('');


    const overlayPanelRef = useRef<OverlayPanel>(null);
    const showOverlayPanel = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (overlayPanelRef.current) {
            overlayPanelRef.current.toggle(e);
        }
    }

    //overpanel input handling
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setInputValue(value);
    }

    const handleSubmit = () => {
        if (typeof inputValue === 'number') {
            alert(`Submitted value: ${inputValue}`);
            handleCheck((currentPage - 1) * 12, inputValue-1)// Clear the input after submission
            overlayPanelRef.current?.hide();
        } else {
            alert('Please enter a valid integer.');
        }
    };



    const onPageChange = (e: any) => {
        setCurrentPage(e.page + 1); // Update page index
    };


    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, rowData: RowDataInterface) => {
        if (e.target.checked) {
            handleCheck(rowData.index, rowData.index); // Check the item
        } else {
            handleRemove(rowData.index); // Uncheck the item
        }
    };
    const checkboxTemplate = (rowData: RowDataInterface) => {
        return (
            <input
                type="checkbox"
                checked={rowData.isChecked}
                onChange={(e) => handleCheckboxChange(e, rowData)}
            />
        );
    };
    
    const handleRowClick = (e: any) => {
        const rowData = e.data as RowDataInterface;

        // Toggle checkbox state manually on row click
        if (!rowData.isChecked) {
            handleCheck(rowData.index, rowData.index); // Check if not already checked
        } else {
            handleRemove(rowData.index); // Uncheck if already checked
        }
    };



    if (loading) {
        return <h2>LOADING ....</h2>;
    }
    if (error) {
        return <h2>Something went wrong</h2>;
    }
    // console.log(data.map((d) => d.isChecked), "=============this is the data")
    return (
        <div className="p-4 mx-auto">
            <DataTable
                value={data}
                dataKey="index"
                paginator={false}
                selectionMode={"multiple"}
                onRowClick={handleRowClick}
                selection={data.filter((d) => d.isChecked)}

            >
                
                <Column
                    selectionMode="multiple"
                    body={checkboxTemplate}
                    headerStyle={{ width: "3rem" }}
                />
                {/* <Column headerStyle={{ width: '3rem' }} body={checkboxTemplate} ></Column> */}
                <Column field="title" header={<Button type="button" icon="pi pi-chevron-down" label="Title" onClick={(e) => { showOverlayPanel(e) }}>
                </Button>} />
                <Column field="place_of_origin" header="Place of Origin" />
                <Column field="artist_display" header="Artist Display" />
                <Column field="inscriptions" header="Inscriptions" />
                <Column field="date_start" header="Start Date" />
                <Column field="date_end" header="End Date" />
            </DataTable>
            <Paginator
                first={(currentPage - 1) * 12} // Calculate the index of first row of the page
                rows={12}
                totalRecords={totalRecords}
                onPageChange={onPageChange}
                rowsPerPageOptions={[12]}
                className="justify-content-center"
                template="PrevPageLink PageLinks NextPageLink"
            />

            <OverlayPanel ref={overlayPanelRef}>
                <div className="flex flex-col max-w-24 text-sm">
                    <input
                        placeholder="Enter integer"
                        type="text"
                        className="p-inputtext p-component mb-2"
                        onChange={handleInputChange}
                    />
                    <button
                        onClick={handleSubmit}
                        className="p-button p-component place-self-center"
                    >
                        Submit
                    </button>
                </div>
            </OverlayPanel>
        </div>
    );
};

export default Table;


