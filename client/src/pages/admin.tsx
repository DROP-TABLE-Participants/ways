import React, { useEffect, useState } from 'react';
import '../styles/page-styles/admin.scss';
import { useNavigate } from 'react-router-dom';

function Admin() {
    const [tiles, setTiles] = useState<{ id: string, x: number, y: number }[]>([]);
    const [gridSize, setGridSize] = useState<{ rows: number, columns: number }>({ rows: 21, columns: 41 });
    const [deleteOperations, setDeleteOperations] = useState<string[]>([]);
    const [putOperations, setPutOperations] = useState<{ x: number, y: number, type: number }[]>([]);

    const navigator = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            navigator('/login');
        }

        fetch(`https://ways-api.azurewebsites.net/api/tile`)
            .then(response => response.json())
            .then((data) => setTiles(data));
    }, []);

    const handleDelete = (productId: string) => {
        setTiles(prevTiles => prevTiles.filter(tile => tile.id !== productId));
        setDeleteOperations(prevDeleteOps => [...prevDeleteOps, productId]);
    };

    const handleAddWall = (x: number, y: number) => {
        const newTile = { id: `new-${x}-${y}`, x, y, type: 4 };
        setTiles(prevTiles => [...prevTiles, newTile]);
        setPutOperations(prevPutOps => [...prevPutOps, { x, y, type: 4 }]);
    };

    const handleSaveChanges = () => {
        // Send delete operations
        deleteOperations.forEach(id => {
            fetch(`https://ways-api.azurewebsites.net/api/tile/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
        });

        // Send put operations
        putOperations.forEach(tile => {
            fetch(`https://ways-api.azurewebsites.net/api/tile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tile),
                credentials: 'include',
            });
        });

        // Clear the operations after sending
        setDeleteOperations([]);
        setPutOperations([]);
    };

    const renderGridItems = () => {
        const occupiedCoords = new Set(tiles.map(tile => `${tile.x},${tile.y}`));
        const gridItems = [];

        for (let row = 0; row < gridSize.rows; row++) {
            for (let col = 0; col < gridSize.columns; col++) {
                const coordKey = `${col},${row}`;
                if (occupiedCoords.has(coordKey)) {
                    const tile = tiles.find(tile => tile.x === col && tile.y === row);
                    gridItems.push(
                        <div
                            key={tile!.id}
                            className="grid-item tile"
                            style={{ gridRow: row + 1, gridColumn: col + 1 }}
                            onClick={() => handleDelete(tile!.id)}
                        >
                        </div>
                    );
                } else {
                    gridItems.push(
                        <div
                            key={`empty-${col}-${row}`}
                            className="grid-item empty"
                            style={{ gridRow: row + 1, gridColumn: col + 1 }}
                            onClick={() => handleAddWall(col, row)}
                        ></div>
                    );
                }
            }
        }

        return gridItems;
    };

    return (
        <div className="admin-container">
            <h1>Административен Панел</h1>
            <h4>Кликнете на свободно квадратче за да поставите стена или на заето <br/> квадратче за да го изтриете при промяна на подретбата в магазина</h4>
            <div className="grid-container">
                {renderGridItems()}
            </div>
            <button onClick={handleSaveChanges} className="save-button">Запази промените</button>
        </div>
    );
}

export default Admin;
