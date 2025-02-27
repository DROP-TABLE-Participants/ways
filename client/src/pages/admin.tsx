import React, { useEffect, useState } from 'react';
import '../styles/page-styles/admin.scss';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';

function Admin() {
    const [tiles, setTiles] = useState<{ id: string, x: number, y: number, type: number }[]>([]);
    const [gridSize, setGridSize] = useState<{ rows: number, columns: number }>({ rows: 21, columns: 41 });
    const [deleteOperations, setDeleteOperations] = useState<string[]>([]);
    const [putOperations, setPutOperations] = useState<{ x: number, y: number, type: number }[]>([]);

    const navigator = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            navigator('/login');
        }

        fetch('https://ways-api.codingburgas.bg/api/tile')
            .then(response => response.json())
            .then((data) => setTiles(data));
    }, []);

    const handleDelete = (tileId: string) => {
        setTiles(prevTiles => prevTiles.filter(tile => tile.id !== tileId));
        setDeleteOperations(prevDeleteOps => [...prevDeleteOps, tileId]);
    };

    const handleAddWall = (x: number, y: number) => {
        const newTile = { id: `new-${x}-${y}`, x, y, type: 4 };
        setTiles(prevTiles => [...prevTiles, newTile]);
        setPutOperations(prevPutOps => [...prevPutOps, { x, y, type: 4 }]);
    };

    const handleLogout = () => {
        fetch('https://ways-api.codingburgas.bg/api/admin/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        localStorage.removeItem('isLoggedIn');
        navigator('/');
        location.reload();
    };

    const handleSaveChanges = async () => {
        const deletePromises = deleteOperations.map(id => 
            fetch(`https://ways-api.codingburgas.bg/api/tile/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })
            .then(response => {
                if (response.ok) {
                    toast.success('Стената е изтрита успешно');
                } else {
                    throw new Error('Неуспешно изтриване на стена');
                }
            })
            .catch(error => {
                toast.error(error.message);
            })
        );

        const putPromises = putOperations.map(tile =>
            fetch('https://ways-api.codingburgas.bg/api/tile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(tile),
            })
            .then(response => {
                if (response.ok) {
                    toast.success('Стената е добавена успешно');
                } else {
                    throw new Error('Неуспешно добавяне на стена');
                }
            })
            .catch(error => {
                toast.error(error.message);
            })
        );

        await Promise.all([...deletePromises, ...putPromises]);

        setDeleteOperations([]);
        setPutOperations([]);

        const res = await fetch('https://ways-api.codingburgas.bg/api/tile');
        const data = await res.json();

        setTiles(data);
    };

    const getTileClass = (type: number) => {
        switch(type) {
            case 0: return 'product';
            case 1: return 'self-checkout';
            case 2: return 'card-only-self-checkout';
            case 3: return 'cash-register';
            case 4: return 'wall';
            case 5: return 'easter-egg';
            case 6: return 'enter';
            case 7: return 'exit';
            default: return '';
        }
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
                            className={`grid-item tile ${getTileClass(tile!.type)}`}
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

    const renderLegend = () => {
        const legendItems = [
            { className: 'product', label: 'Product' },
            { className: 'self-checkout', label: 'Self Checkout' },
            { className: 'card-only-self-checkout', label: 'Card Only Self Checkout' },
            { className: 'cash-register', label: 'Cash Register' },
            { className: 'wall', label: 'Wall' },
            { className: 'easter-egg', label: 'Easter Egg' },
            { className: 'enter', label: 'Enter' },
            { className: 'exit', label: 'Exit' }
        ];

        return (
            <div className="legend">
                {legendItems.map(item => (
                    <div key={item.className} className="legend-item">
                        <div className={`legend-tile grid-item ${item.className}`}></div>
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="admin-container">
            <Toaster richColors />
            <h1>Административен Панел</h1>
            <h4>Кликнете на свободно квадратче за да поставите стена или <br/> на заето квадратче за да го изтриете при промяна на подретбата в магазина</h4>
            <div className="grid-container">
                {renderGridItems()}
            </div>
            {renderLegend()}
            <button onClick={handleSaveChanges} className="save-button">Запази промените</button>
            <button onClick={handleLogout} className="logout-button">Излез</button>
        </div>
    );
}

export default Admin;
