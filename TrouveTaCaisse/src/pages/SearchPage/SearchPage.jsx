import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Empty, Spin, Pagination, Form, Select, Input, Button, Space, InputNumber } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { CATEGORIES, TRANSMISSIONS, FUELS, YEARS, MAKES } from '../../constants/carFilters';
import api from '../../api/axios';
import styles from './SearchPage.module.css';

const { Option } = Select;

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        // On renseine tous le critères de recherche du formulaireavec les critères dans l'URL
        form.setFieldsValue({
            make: searchParams.get('make') || undefined,
            model: searchParams.get('model') || undefined,
            year: searchParams.get('year') || undefined,
            category: searchParams.get('category') || undefined,
            transmission: searchParams.get('transmission') || undefined,
            fuel: searchParams.get('fuel') || undefined,
        });

        // On lance ensuitela recherche
        fetchSearchResults();
    }, [searchParams]);

    const fetchSearchResults = async () => {
        setLoading(true);
        try {
            // On construit l'URL avec tous les critères de recherche
            const params = new URLSearchParams(searchParams);
            const response = await api.get(`/cars/search?${params.toString()}`);
            if (response.data && response.data.cars) {
                // Dans la réponse, on récupère la liste des voitures et le nombre total de résultats
                setCars(response.data.cars);
                setTotal(response.data.total);
            } else {
                setCars([]);
                setTotal(0);
            }
        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
            setCars([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (values) => {
        // On va modifier la route à la soumission du formulaire de recherche avec tous les valeurs des champs
        const params = {};
        Object.keys(values).forEach(key => {
            if (values[key]) {
                params[key] = values[key];
            }
        });
        setSearchParams(params);
    };

    const handleCardClick = (carId) => {
        // On va passer à l'appel de la route pour afficher le détail de la voiture, les critères de recherche pour pouvoir réapliquer les critères de recherche si on revient sur la recherhe
        const searchState = '?' + searchParams.toString();
        navigate(`/car/${carId}`, { 
            state: { searchState } 
        });
    };

    const handlePageChange = (page) => {
        // Au changement de page, on va modifier la route avec le numéro de la page
        setCurrentPage(page);
        const currentParams = Object.fromEntries(searchParams.entries());
        setSearchParams({ ...currentParams, page: page.toString() });
    };

    const handleReset = () => {
        // A la réinitialisation du formulaire, on vide tous le champs et on supprime tous les critères de recherche dans la route
        form.resetFields();
        setSearchParams({});
    };

    return (
        <div className={styles.container}>
            <div className={styles.searchForm}>
                <Form
                    form={form}
                    onFinish={handleSearch}
                    layout="vertical"
                    className={styles.form}
                >
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={6}>
                            <Form.Item name="make" label="Marque">
                                <Select placeholder="Marque" showSearch>
                                    {MAKES.map(make => (
                                        <Option key={make} value={make}>{make}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Form.Item name="model" label="Modèle">
                                <Input placeholder="Modèle" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Form.Item name="year" label="Année">
                                <Select placeholder="Année" showSearch>
                                    {YEARS.map(year => (
                                        <Option key={year} value={year}>{year}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Form.Item name="category" label="Catégorie" showSearch>
                                <Select placeholder="Catégorie" showSearch>
                                    {CATEGORIES.map(cat => (
                                        <Option key={cat} value={cat}>{cat}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Form.Item name="transmission" label="Transmission">
                                <Select placeholder="Transmission" showSearch>
                                    {TRANSMISSIONS.map(trans => (
                                        <Option key={trans} value={trans}>{trans}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Form.Item name="fuel" label="Carburant">
                                <Select placeholder="Carburant" showSearch>
                                    {FUELS.map(fuel => (
                                        <Option key={fuel} value={fuel}>{fuel}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Form.Item label="Consommation (L/100km)">
                                <Space>
                                    <Form.Item
                                        name="minConsumption"
                                        noStyle
                                    >
                                        <InputNumber
                                            placeholder="Min"
                                            min={0}
                                            max={50}
                                            step={0.1}
                                            style={{ width: '100px' }}
                                        />
                                    </Form.Item>
                                    <span style={{ color: 'white' }}>à</span>
                                    <Form.Item
                                        name="maxConsumption"
                                        noStyle
                                    >
                                        <InputNumber
                                            placeholder="Max"
                                            min={0}
                                            max={50}
                                            step={0.1}
                                            style={{ width: '100px' }}
                                        />
                                    </Form.Item>
                                </Space>
                            </Form.Item>
                        </Col>
                        <Col xs={24} className={styles.searchButtonContainer}>
                            <Space>
                                <Button 
                                    icon={<ClearOutlined />}
                                    onClick={handleReset}
                                >
                                    Réinitialiser
                                </Button>
                                <Button 
                                    type="primary" 
                                    icon={<SearchOutlined />} 
                                    htmlType="submit"
                                >
                                    Rechercher
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </Form>
            </div>

            {loading ? (
                <div className="loadingContainer">
                    <Spin size="large" />
                </div>
            ) : cars.length === 0 ? (
                <Empty 
                    className={styles.empty}
                    description={
                        <span>Aucun véhicule trouvé</span>
                    }
                />
            ) : (
                <>
                    <div className={styles.resultCount}>
                        {total} véhicule{total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}
                    </div>
                    <Row gutter={[24, 24]}>
                        {cars.map((car) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={car.id}>
                                <Card
                                    hoverable
                                    className={styles.carCard}
                                    onClick={() => handleCardClick(car.id)}
                                >
                                    <Card.Meta
                                        title={`${car.make} ${car.model}`}
                                        description={
                                            <div>
                                                <p><strong>Année :</strong> {car.year}</p>
                                                <p><strong>Catégorie :</strong> {car.category}</p>
                                                <p><strong>Transmission :</strong> {car.transmission}</p>
                                                <p><strong>Carburant :</strong> {car.fuel}</p>
                                                <p><strong>Consommation :</strong> {car.consumption}</p>
                                            </div>
                                        }
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    {total > 8 && (
                        <div className={styles.pagination}>
                            <Pagination
                                current={currentPage}
                                total={total}
                                pageSize={8}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SearchPage; 