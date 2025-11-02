import { useState, useEffect } from 'react';
import { documentsApi, assetsApi } from '../src/services/api';

// Test data
const mockUser = {
  name: 'Filip Andersson',
  personalNumber: '199001011234',
  email: 'filip.andersson@example.com',
};

const mockTransactions = [
  { id: 1, type: 'received', amount: '+100', from: 'CastleGate Airdrop', date: '2025-01-01', icon: '💰' },
  { id: 2, type: 'received', amount: '+25', from: 'Referral Bonus', date: '2024-12-28', icon: '🎁' },
  { id: 3, type: 'sent', amount: '-50', to: 'Premium Subscription', date: '2024-12-20', icon: '💳' },
  { id: 4, type: 'received', amount: '+75', from: 'Partner Reward', date: '2024-12-10', icon: '⭐' },
];

const mockOffers = [
  { id: 1, title: 'Bättre Hemförsäkring', provider: 'Insurance Plus', discount: '20%', category: 'insurance', savings: '3,600 kr/år', icon: '🛡️' },
  { id: 2, title: 'Premium Bankkonto', provider: 'Finance Bank', interest: '3.5%', category: 'finance', icon: '🏦' },
  { id: 3, title: 'Hälsovårdsplan', provider: 'HealthCare Pro', discount: '15%', category: 'healthcare', icon: '🏥' },
];

const mockAIQuestions = [
  { q: 'Hur många dokument har jag?', a: 'Du har för närvarande 6 dokument i din säkra box.' },
  { q: 'Vad är mitt Castlegate Coins saldo?', a: 'Ditt saldo är 1,234 CGC. Detta motsvarar ungefär $150 USD.' },
  { q: 'När ska jag förnya min försäkring?', a: 'Din nuvarande försäkring löper ut 2025-12-31. Jag rekommenderar att börja jämföra alternativ nu.' },
];

const initialDocuments = [
  { id: 1, name: 'Passport.pdf', type: 'Passport', uploaded: '2025-01-15', icon: '🛂' },
  { id: 2, name: 'Insurance_Policy.pdf', type: 'Insurance', uploaded: '2025-01-10', icon: '🛡️' },
  { id: 3, name: 'Bank_Statement.pdf', type: 'Finance', uploaded: '2025-01-05', icon: '🏦' },
  { id: 4, name: 'Drivers_License.pdf', type: 'License', uploaded: '2024-12-20', icon: '🚗' },
  { id: 5, name: 'Medical_Records.pdf', type: 'Health', uploaded: '2024-12-10', icon: '🏥' },
  { id: 6, name: 'Property_Deed.pdf', type: 'Property', uploaded: '2024-11-15', icon: '🏠' },
];

const initialAssets = [
  { id: 1, name: 'Tesla Model 3', provider: 'Tesla', type: 'vehicle', value: '450,000 kr', purchase: '2023-05-15', status: 'active', icon: '🚗' },
  { id: 2, name: 'MacBook Pro 16"', provider: 'Apple', type: 'computer', value: '32,000 kr', purchase: '2024-11-01', status: 'active', icon: '💻' },
  { id: 3, name: 'Avanza Pension 75', provider: 'Avanza', type: 'fund', value: '850,000 kr', purchase: '2018-01-15', status: 'active', icon: '📈' },
  { id: 4, name: 'Apple Aktier', provider: 'NASDAQ', type: 'stock', value: '125,500 kr', purchase: '2020-03-20', status: 'active', icon: '📊' },
  { id: 5, name: 'Lysa ETF', provider: 'Lysa', type: 'fund', value: '230,000 kr', purchase: '2022-06-10', status: 'active', icon: '🌍' },
  { id: 6, name: 'Premium Bankkonto', provider: 'Handelsbanken', type: 'banking', value: '45,000 kr', purchase: 'Permanent', status: 'active', icon: '🏦' },
  { id: 7, name: 'Hemförsäkring', provider: 'IF Insurance', type: 'insurance', value: '12,000 kr/år', purchase: '2024-01-01', status: 'active', icon: '🛡️' },
  { id: 8, name: 'Villa i Stockholm', provider: 'Hemnet', type: 'property', value: '3,500,000 kr', purchase: '2021-08-20', status: 'active', icon: '🏠' },
];

export default function Home() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [currentTime, setCurrentTime] = useState('');
  const [documents, setDocuments] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [showEditDocModal, setShowEditDocModal] = useState(false);
  const [showEditAssetModal, setShowEditAssetModal] = useState(false);
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<any>(null);
  const [editingAsset, setEditingAsset] = useState<any>(null);
  const [totalValue, setTotalValue] = useState('0 kr');

  // Calculate total value from assets
  useEffect(() => {
    const calculateTotalValue = () => {
      let total = 0;
      assets.forEach(asset => {
        // Parse value from strings like "450,000 kr", "3,500,000 kr", etc.
        const valueStr = asset.value;
        // Remove "kr", "/år", spaces, and commas, then parse as number
        const cleanValue = valueStr.replace(/kr|år|\s|,/g, '');
        const numValue = parseFloat(cleanValue);
        if (!isNaN(numValue)) {
          total += numValue;
        }
      });
      
      // Format total value with spaces as thousand separators
      const formattedTotal = Math.round(total).toLocaleString('sv-SE');
      setTotalValue(`${formattedTotal} kr`);
    };
    
    calculateTotalValue();
  }, [assets]);

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('sv-SE', { 
        hour: '2-digit', 
        minute: '2-digit',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load data from API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [docs, assetList] = await Promise.all([
          documentsApi.getAll(),
          assetsApi.getAll()
        ]);
        setDocuments(docs);
        setAssets(assetList);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to initial data if API fails
        setDocuments(initialDocuments);
        setAssets(initialAssets);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerLeft}>
            <div style={styles.logo}>🏰 CastleGate</div>
            <div style={styles.tagline}>Virtually Me</div>
          </div>
          <div style={styles.headerRight}>
            <button 
              style={styles.notificationBtn}
              title="Notifikationer"
            >🔔</button>
            <button 
              style={styles.profileBtn}
              title={mockUser.name}
            >
              <span style={styles.profileIcon}>👤</span>
              <span style={styles.profileName}>{mockUser.name.split(' ')[0]}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Welcome Card */}
      <section style={styles.welcomeCard}>
        <div style={styles.welcomeContent}>
          <div style={styles.avatar}>{mockUser.name.split(' ').map(n => n[0]).join('')}</div>
          <div style={styles.welcomeText}>
            <h1 style={styles.welcomeTitle}>Välkommen, {mockUser.name.split(' ')[0]}!</h1>
            <p style={styles.welcomeSubtitle}>Din digitala livskontroll - Alltid tillgänglig och säker</p>
            <p style={styles.welcomeTime}>{currentTime}</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📄</div>
          <div style={styles.statValue}>{documents.length}</div>
          <div style={styles.statTitle}>Dokument</div>
          <div style={styles.statChange}>+2 denna månaden</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>💼</div>
          <div style={styles.statValue}>{assets.length}</div>
          <div style={styles.statTitle}>Aktiva Tillgångar</div>
          <div style={styles.statChange}>+2 nya detta året</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>💰</div>
          <div style={styles.statValue}>1,234</div>
          <div style={styles.statTitle}>Castlegate Coins</div>
          <div style={styles.statChange}>+200 senaste månaden</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🛡️</div>
          <div style={styles.statValue}>98%</div>
          <div style={styles.statTitle}>Säkerhet</div>
          <div style={styles.statChange}>Allt skydd hos</div>
        </div>
      </section>

      {/* Tabs */}
      <section style={styles.tabsContainer}>
        {[
          { name: 'Översikt', icon: '🏠' },
          { name: 'Dokument', icon: '📄' },
          { name: 'Tillgångar', icon: '💼' },
          { name: 'Wallet', icon: '💰' },
          { name: 'AI', icon: '🤖' },
          { name: 'Marknadsplats', icon: '🏪' },
          { name: 'Inställningar', icon: '⚙️' },
        ].map((tab, index) => (
          <button
            key={index}
            style={{
              ...styles.tab,
              ...(selectedTab === index ? styles.tabActive : {}),
            }}
            onClick={() => setSelectedTab(index)}
          >
            <span style={{ fontSize: '24px' }}>{tab.icon}</span>
            <span style={{ fontSize: '14px' }}>{tab.name}</span>
          </button>
        ))}
      </section>

      {/* Content */}
      <section style={styles.content}>
        {selectedTab === 0 && (
          <div>
            <div style={styles.headerRow}>
              <h2 style={styles.h2}>Dashboard</h2>
              <span style={styles.badge}>Ny</span>
            </div>
            
            <div style={styles.chipsContainer}>
              <span style={styles.chip}>🤖 3 AI-rekommendationer</span>
              <span style={styles.chip}>🏪 2 nya erbjudanden</span>
              <span style={styles.chip}>🛡️ 1 avtal förnyas snart</span>
            </div>

            <div style={styles.recommendationCard}>
              <div style={styles.recommendationHeader}>
                <span style={styles.recommendationIcon}>🎯</span>
                <div>
                  <h3 style={styles.recommendationTitle}>AI-förslag</h3>
                  <p style={styles.recommendationSubtitle}>Personligt skräddarsytt för dig</p>
                </div>
              </div>
              <p style={styles.recommendationText}>
                🔍 Vi har hittat en bättre hemförsäkring – <strong>spara 20% (3,600 kr/år)</strong> med samma täckning!
              </p>
              <button 
                style={styles.actionButton}
                onClick={() => setSelectedTab(5)}
              >Visa erbjudande</button>
            </div>

            <div style={styles.quickActions}>
              <h3 style={styles.quickActionsTitle}>Snabbåtgärder</h3>
              <div style={styles.actionsGrid}>
                <button 
                  style={styles.actionCard}
                  onClick={() => setSelectedTab(1)}
                >
                  <span style={styles.actionIcon}>📤</span>
                  <span>Ladda upp dokument</span>
                </button>
                <button 
                  style={styles.actionCard}
                  onClick={() => {
                    setSelectedTab(1);
                    const input = document.querySelector('input[placeholder*="Sök"]') as HTMLInputElement;
                    setTimeout(() => input?.focus(), 100);
                  }}
                >
                  <span style={styles.actionIcon}>🔍</span>
                  <span>Sök i dokument</span>
                </button>
                <button 
                  style={styles.actionCard}
                  onClick={() => setSelectedTab(4)}
                >
                  <span style={styles.actionIcon}>💬</span>
                  <span>Kolla AI-assistent</span>
                </button>
                <button 
                  style={styles.actionCard}
                  onClick={() => setSelectedTab(6)}
                >
                  <span style={styles.actionIcon}>⚙️</span>
                  <span>Inställningar</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 1 && (
          <div>
            <div style={styles.headerRow}>
              <h2 style={styles.h2}>Mina Dokument</h2>
              <button 
                style={styles.addButton}
                onClick={() => setShowAddDocModal(true)}
              >+ Nytt dokument</button>
            </div>

            <div style={styles.searchBar}>
              <input 
                type="text" 
                placeholder="🔍 Sök bland dina dokument..." 
                style={styles.searchInput}
              />
            </div>

            <div style={styles.documentsList}>
              {documents.map((doc) => (
                <div key={doc.id} style={styles.documentItem}>
                  <div style={styles.documentIcon}>{doc.icon}</div>
                  <div style={styles.documentInfo}>
                    <div style={styles.documentName}>{doc.name}</div>
                    <div style={styles.documentMeta}>
                      <span>{doc.type}</span>
                      <span>•</span>
                      <span>{doc.uploaded}</span>
                    </div>
                  </div>
                  <div style={styles.documentActions}>
                    <button 
                      style={styles.textButton}
                      onClick={async () => {
                        if ((doc as any).filename) {
                          // If file exists, open it to view
                          try {
                            await documentsApi.download(doc.id, true);
                          } catch (error) {
                            console.error('Error viewing document:', error);
                            alert('Kunde inte öppna dokumentet. Filen kanske inte finns.');
                          }
                        } else {
                          // If no file, just show info
                          alert(`Dokument: ${doc.name}\nTyp: ${doc.type || 'N/A'}\nIngen fil bifogad.`);
                        }
                      }}
                    >Visa</button>
                    <button 
                      style={styles.textButton}
                      onClick={async () => {
                        try {
                          await documentsApi.download(doc.id);
                        } catch (error) {
                          console.error('Error downloading document:', error);
                          alert('Kunde inte ladda ner dokumentet. Filen kanske inte finns.');
                        }
                      }}
                      disabled={!(doc as any).filename}
                    >Ladda ner</button>
                    <button 
                      style={styles.textButton}
                      onClick={() => {
                        setEditingDoc(doc);
                        setShowEditDocModal(true);
                      }}
                    >Redigera</button>
                    <button 
                      style={styles.textButton}
                      onClick={async () => {
                        if (confirm(`Är du säker på att du vill ta bort "${doc.name}"?`)) {
                          try {
                            await documentsApi.delete(doc.id);
                            setDocuments(documents.filter(d => d.id !== doc.id));
                          } catch (error) {
                            console.error('Error deleting document:', error);
                            alert('Kunde inte ta bort dokumentet');
                          }
                        }
                      }}
                    >Ta bort</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 2 && (
          <div>
            <div style={styles.headerRow}>
              <h2 style={styles.h2}>Mina Tillgångar</h2>
              <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
                <div style={styles.totalValue}>Totalt värde: {totalValue}</div>
                <button 
                  style={styles.addButton}
                  onClick={() => setShowAddAssetModal(true)}
                >+ Ny tillgång</button>
              </div>
            </div>

            <div style={styles.assetsGrid}>
              {assets.map((asset) => (
                <div key={asset.id} style={styles.assetCard}>
                  <div style={styles.assetHeader}>
                    <div style={styles.assetIcon}>{asset.icon}</div>
                    <div>
                      <h3 style={styles.assetName}>{asset.name}</h3>
                      <p style={styles.assetProvider}>{asset.provider}</p>
                    </div>
                  </div>
                  <div style={styles.assetDetails}>
                    <div style={styles.assetRow}>
                      <span style={styles.assetLabel}>Värde:</span>
                      <span style={styles.assetValue}>{asset.value}</span>
                    </div>
                    <div style={styles.assetRow}>
                      <span style={styles.assetLabel}>Status:</span>
                      <span style={{...styles.assetStatus, color: '#4caf50'}}>● Aktiv</span>
                    </div>
                    <div style={styles.assetRow}>
                      <span style={styles.assetLabel}>{asset.type === 'insurance' ? 'Utgång:' : 'Inköp:'}</span>
                      <span style={styles.assetValue}>{(asset as any).expiry || asset.purchase}</span>
                    </div>
                  </div>
                  <div style={styles.assetActions}>
                    <button 
                      style={styles.viewButton}
                      title="Visa detaljer"
                      onClick={() => {
                        alert(`Tillgång: ${asset.name}\nProvider: ${asset.provider}\nTyp: ${asset.type}\nVärde: ${asset.value}\nInköp: ${asset.purchase}`);
                      }}
                    >👁️ Visa</button>
                    <button 
                      style={styles.manageButton}
                      onClick={() => { setEditingAsset(asset); setShowEditAssetModal(true); }}
                      title="Redigera tillgång"
                    >✏️ Redigera</button>
                    <button 
                      style={styles.viewButton}
                      onClick={async () => {
                        if (confirm(`Är du säker på att du vill ta bort "${asset.name}"?`)) {
                          try {
                            await assetsApi.delete(asset.id);
                            setAssets(assets.filter(a => a.id !== asset.id));
                          } catch (error) {
                            console.error('Error deleting asset:', error);
                            alert('Kunde inte ta bort tillgången');
                          }
                        }
                      }}
                      title="Ta bort tillgång"
                    >🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 3 && (
          <div>
            <div style={styles.headerRow}>
              <h2 style={styles.h2}>Wallet & Castlegate Coins</h2>
            </div>

            <div style={styles.walletBalance}>
              <div style={styles.balanceAmount}>1,234 CGC</div>
              <div style={styles.balanceUSD}>≈ $150 USD</div>
            </div>

            <div style={styles.walletAddress}>
              <div style={styles.addressLabel}>Wallet Address:</div>
              <div style={styles.addressValue}>
                0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0
                <button 
                  style={styles.copyButton}
                  title="Kopiera adress"
                  disabled
                >📋</button>
              </div>
            </div>

            <div style={styles.actionButtons}>
              <button 
                style={styles.primaryButton}
                title="Ta emot"
                disabled
              >📥 Ta emot</button>
              <button 
                style={styles.primaryButton}
                title="Skicka"
                disabled
              >📤 Skicka</button>
              <button 
                style={styles.secondaryButton}
                title="Private Key"
                disabled
              >🔐 Private Key</button>
            </div>

            <div style={styles.transactionsSection}>
              <h3 style={styles.transactionsTitle}>Senaste transaktioner</h3>
              <div style={styles.transactionsList}>
                {mockTransactions.map((tx) => (
                  <div key={tx.id} style={styles.transactionItem}>
                    <div style={styles.transactionIcon}>{tx.icon}</div>
                    <div style={styles.transactionInfo}>
                      <div style={styles.transactionLabel}>
                        {tx.type === 'received' ? tx.from : tx.to}
                      </div>
                      <div style={styles.transactionDate}>{tx.date}</div>
                    </div>
                    <div style={{
                      ...styles.transactionAmount,
                      color: tx.type === 'received' ? '#4caf50' : '#f44336',
                    }}>
                      {tx.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 4 && (
          <div>
            <div style={styles.headerRow}>
              <h2 style={styles.h2}>AI-assistent</h2>
              <span style={styles.badge}>Beta</span>
            </div>

            <div style={styles.aiIntro}>
              <div style={styles.aiIcon}>🤖</div>
              <h3 style={styles.aiTitle}>CastleGate AI - Din personliga assistent</h3>
              <p style={styles.aiSubtitle}>
                Fråga mig om dina dokument, tillgångar, avtal, säkerhet, eller låt mig hjälpa dig att hitta bättre erbjudanden.
              </p>
            </div>

            <div style={styles.aiExamples}>
              <h4 style={styles.examplesTitle}>Prova att fråga:</h4>
              {mockAIQuestions.map((item, idx) => (
                <div key={idx} style={styles.exampleCard}>
                  <div style={styles.exampleQ}>❓ {item.q}</div>
                  <div style={styles.exampleA}>✅ {item.a}</div>
                </div>
              ))}
            </div>

            <div style={styles.chatInput}>
              <input 
                type="text" 
                placeholder="Ställ en fråga till AI-assistenten..." 
                style={styles.chatInputField}
              />
              <button 
                style={styles.chatSendButton}
                title="Skicka meddelande"
                disabled
              >📤</button>
            </div>
          </div>
        )}

        {selectedTab === 5 && (
          <div>
            <div style={styles.headerRow}>
              <h2 style={styles.h2}>Min Marknadsplats</h2>
              <span style={styles.badge}>Permission Marketing</span>
            </div>

            <div style={styles.marketplaceIntro}>
              <p style={styles.marketplaceText}>
                💡 <strong>Du styr!</strong> Välj vilka erbjudanden du vill se. Ingen spam - bara relevanta erbjudanden baserade på dina preferenser.
              </p>
            </div>

            <div style={styles.categories}>
              <div style={styles.categoryRow}>
                <div style={styles.categoryTitle}>Kategorier:</div>
                <div style={styles.categoryTags}>
                  <span style={styles.categoryTag}>🛡️ Försäkring</span>
                  <span style={styles.categoryTag}>🏦 Finans</span>
                  <span style={styles.categoryTag}>🏥 Hälsa</span>
                  <span style={styles.categoryTag}>🏠 Fastighet</span>
                </div>
              </div>
            </div>

            <div style={styles.offersList}>
              {mockOffers.map((offer) => (
                <div key={offer.id} style={styles.offerCard}>
                  <div style={styles.offerIcon}>{offer.icon}</div>
                  <div style={styles.offerContent}>
                    <div style={styles.offerTitle}>{offer.title}</div>
                    <div style={styles.offerProvider}>{offer.provider}</div>
                    {offer.discount && (
                      <div style={styles.offerBadge}>🎉 {offer.discount} rabatt</div>
                    )}
                    {offer.interest && (
                      <div style={styles.offerBadge}>⭐ {offer.interest} ränta</div>
                    )}
                    {offer.savings && (
                      <div style={styles.offerSavings}>Spara: {offer.savings}</div>
                    )}
                  </div>
                  <button 
                    style={styles.offerButton}
                    title="Visa detaljer"
                    disabled
                  >Visa</button>
                </div>
              ))}
            </div>

            <div style={styles.emptyOffers}>
              <p>🎁 Mer erbjudanden kommer snart...</p>
              <p style={styles.emptySubtext}>Ju fler dokument du lägger till, desto bättre blir rekommendationerna!</p>
            </div>
          </div>
        )}

        {selectedTab === 6 && (
          <div>
            <div style={styles.headerRow}>
              <h2 style={styles.h2}>Inställningar</h2>
            </div>

            <div style={styles.settingsCard}>
              <h3 style={styles.settingsTitle}>🎨 Utseende</h3>
              <div style={styles.settingsSection}>
                <div style={styles.settingItem}>
                  <label style={styles.settingLabel}>Mörkt läge</label>
                  <input type="checkbox" style={styles.checkbox} />
                </div>
                <div style={styles.settingItem}>
                  <label style={styles.settingLabel}>Språk</label>
                  <select style={styles.settingSelect}>
                    <option>Svenska</option>
                    <option>English</option>
                    <option>Norsk</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={styles.settingsCard}>
              <h3 style={styles.settingsTitle}>🔒 Säkerhet & Integritet</h3>
              <div style={styles.settingsSection}>
                <div style={styles.settingItem}>
                  <label style={styles.settingLabel}>Censurera känslig data i översikter</label>
                  <input type="checkbox" defaultChecked style={styles.checkbox} />
                </div>
                <div style={styles.settingItem}>
                  <label style={styles.settingLabel}>Biometrisk inloggning krävs</label>
                  <input type="checkbox" style={styles.checkbox} />
                </div>
                <div style={styles.settingItem}>
                  <label style={styles.settingLabel}>Automatisk utloggning efter</label>
                  <select style={styles.settingSelect}>
                    <option>15 minuter</option>
                    <option>30 minuter</option>
                    <option>1 timme</option>
                    <option>Ingen</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={styles.settingsCard}>
              <h3 style={styles.settingsTitle}>📧 Notifikationer</h3>
              <div style={styles.settingsSection}>
                <div style={styles.settingItem}>
                  <label style={styles.settingLabel}>Email notifikationer</label>
                  <input type="checkbox" defaultChecked style={styles.checkbox} />
                </div>
                <div style={styles.settingItem}>
                  <label style={styles.settingLabel}>Push notifikationer</label>
                  <input type="checkbox" style={styles.checkbox} />
                </div>
                <div style={styles.settingItem}>
                  <label style={styles.settingLabel}>Marknadsplats erbjudanden</label>
                  <input type="checkbox" defaultChecked style={styles.checkbox} />
                </div>
                <div style={styles.settingItem}>
                  <label style={styles.settingLabel}>AI-rekommendationer</label>
                  <input type="checkbox" defaultChecked style={styles.checkbox} />
                </div>
              </div>
            </div>

            <div style={styles.settingsCard}>
              <h3 style={styles.settingsTitle}>💼 Marknadsplats Inställningar</h3>
              <div style={styles.settingsSection}>
                <div style={styles.settingItem}>
                  <label style={styles.settingLabel}>Tillåt företag att kontakta mig</label>
                  <input type="checkbox" defaultChecked style={styles.checkbox} />
                </div>
                <div style={styles.settingItem}>
                  <label style={styles.settingLabel}>Dela anonym statistik</label>
                  <input type="checkbox" defaultChecked style={styles.checkbox} />
                </div>
                <p style={styles.settingsDesc}>Hjälp oss förbättra tjänsten genom att dela anonymiserad data.</p>
              </div>
            </div>

            <div style={styles.settingsCard}>
              <h3 style={styles.settingsTitle}>🗑️ Konto</h3>
              <div style={styles.settingsSection}>
                <button style={styles.dangerButton}>Exportera all data</button>
                <button style={styles.dangerButton}>Radera mitt konto</button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Modal: Add Document */}
      {showAddDocModal && (
        <div style={styles.modalOverlay} onClick={() => setShowAddDocModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>➕ Lägg till nytt dokument</h2>
            <div style={styles.modalForm}>
              <input type="text" placeholder="Dokumentnamn (valfritt, använder filnamn om tomt)" style={styles.modalInput} id="docName" />
              <select style={styles.modalInput} id="docType">
                <option>Passport 🛂</option>
                <option>ID-kort 🪪</option>
                <option>Insurance 🛡️</option>
                <option>Finance 🏦</option>
                <option>Taxes 💵</option>
                <option>License 🚗</option>
                <option>Health 🏥</option>
                <option>Property 🏠</option>
                <option>Contract 📄</option>
                <option>Certificate 📜</option>
                <option>Vaccination 💉</option>
                <option>Education 🎓</option>
                <option>Legal ⚖️</option>
                <option>Other 📋</option>
              </select>
              <input 
                type="file" 
                style={styles.modalInput} 
                id="docFile" 
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              />
              <div style={{ fontSize: '12px', color: '#666', marginTop: '-10px', marginBottom: '10px' }}>
                Accepterade format: PDF, Word, Excel, Bilder (max 10MB)
              </div>
              <div style={styles.modalActions}>
                <button style={styles.modalButton} onClick={() => setShowAddDocModal(false)}>Avbryt</button>
                <button style={{...styles.modalButton, ...styles.modalButtonPrimary}} onClick={async () => {
                  const nameInput = document.getElementById('docName') as HTMLInputElement;
                  const typeInput = document.getElementById('docType') as HTMLSelectElement;
                  const fileInput = document.getElementById('docFile') as HTMLInputElement;
                  const file = fileInput.files?.[0];
                  
                  if (!file && !nameInput.value.trim()) {
                    alert('Vänligen välj en fil eller ange ett dokumentnamn');
                    return;
                  }
                  
                  try {
                    // Extract type and icon from the combined select
                    const fullType = typeInput.value;
                    const icon = fullType.match(/[\u{1F300}-\u{1F9FF}]/u)?.[0] || '📄';
                    const type = fullType.replace(/[\u{1F300}-\u{1F9FF}]/u, '').trim();
                    
                    const newDoc = await documentsApi.create({
                      name: nameInput.value.trim() || file?.name || 'Dokument',
                      type: type,
                      icon: icon
                    }, file || undefined);
                    setDocuments([...documents, { ...newDoc, uploaded: new Date().toISOString().split('T')[0] }]);
                    setShowAddDocModal(false);
                    // Reset file input
                    fileInput.value = '';
                  } catch (error) {
                    console.error('Error creating document:', error);
                    alert('Kunde inte skapa dokumentet');
                  }
                }}>Lägg till</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Document */}
      {showEditDocModal && editingDoc && (
        <div style={styles.modalOverlay} onClick={() => { setShowEditDocModal(false); setEditingDoc(null); }}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>✏️ Redigera dokument</h2>
            <div style={styles.modalForm}>
              <input type="text" defaultValue={editingDoc.name} style={styles.modalInput} id="editDocName" />
              <select style={styles.modalInput} id="editDocType" defaultValue={`${editingDoc.type || ''} ${editingDoc.icon || ''}`}>
                <option>Passport 🛂</option>
                <option>ID-kort 🪪</option>
                <option>Insurance 🛡️</option>
                <option>Finance 🏦</option>
                <option>Taxes 💵</option>
                <option>License 🚗</option>
                <option>Health 🏥</option>
                <option>Property 🏠</option>
                <option>Contract 📄</option>
                <option>Certificate 📜</option>
                <option>Vaccination 💉</option>
                <option>Education 🎓</option>
                <option>Legal ⚖️</option>
                <option>Other 📋</option>
              </select>
              <div style={styles.modalActions}>
                <button style={styles.modalButton} onClick={() => { setShowEditDocModal(false); setEditingDoc(null); }}>Avbryt</button>
                <button style={{...styles.modalButton, ...styles.modalButtonPrimary}} onClick={async () => {
                  const nameInput = document.getElementById('editDocName') as HTMLInputElement;
                  const typeInput = document.getElementById('editDocType') as HTMLSelectElement;
                  try {
                    // Extract type and icon from the combined select
                    const fullType = typeInput.value;
                    const icon = fullType.match(/[\u{1F300}-\u{1F9FF}]/u)?.[0] || '📄';
                    const type = fullType.replace(/[\u{1F300}-\u{1F9FF}]/u, '').trim();
                    
                    await documentsApi.update(editingDoc.id, {
                      name: nameInput.value,
                      type: type,
                      icon: icon
                    });
                    const updated = documents.map(d => 
                      d.id === editingDoc.id ? {
                        ...d,
                        name: nameInput.value,
                        type: type,
                        icon: icon
                      } : d
                    );
                    setDocuments(updated);
                    setShowEditDocModal(false);
                    setEditingDoc(null);
                  } catch (error) {
                    console.error('Error updating document:', error);
                    alert('Kunde inte uppdatera dokumentet');
                  }
                }}>Spara</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Asset */}
      {showAddAssetModal && (
        <div style={styles.modalOverlay} onClick={() => setShowAddAssetModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>➕ Lägg till ny tillgång</h2>
            <div style={styles.modalForm}>
              <input type="text" placeholder="Namn" style={styles.modalInput} id="assetName" />
              <input type="text" placeholder="Provider" style={styles.modalInput} id="assetProvider" />
              <select style={styles.modalInput} id="assetType">
                <option>Vehicle 🚗</option>
                <option>Computer 💻</option>
                <option>Fund 📈</option>
                <option>Stock 📊</option>
                <option>Banking 🏦</option>
                <option>Insurance 🛡️</option>
                <option>Property 🏠</option>
                <option>Electronics 📱</option>
                <option>Real Estate 🏡</option>
                <option>Collectibles 🎨</option>
                <option>Crypto ₿</option>
                <option>Savings 💰</option>
                <option>Investment 💎</option>
                <option>Other ⚡</option>
              </select>
              <input type="text" placeholder="Värde (t.ex. 100,000 kr)" style={styles.modalInput} id="assetValue" />
              <input type="text" placeholder="Inköpsdatum (YYYY-MM-DD)" style={styles.modalInput} id="assetPurchase" />
              <div style={styles.modalActions}>
                <button style={styles.modalButton} onClick={() => setShowAddAssetModal(false)}>Avbryt</button>
                <button style={{...styles.modalButton, ...styles.modalButtonPrimary}} onClick={async () => {
                  const nameInput = document.getElementById('assetName') as HTMLInputElement;
                  const providerInput = document.getElementById('assetProvider') as HTMLInputElement;
                  const typeInput = document.getElementById('assetType') as HTMLSelectElement;
                  const valueInput = document.getElementById('assetValue') as HTMLInputElement;
                  const purchaseInput = document.getElementById('assetPurchase') as HTMLInputElement;
                  if (nameInput.value.trim() && providerInput.value.trim()) {
                    try {
                      // Extract type and icon from the combined select
                      const fullType = typeInput.value;
                      const icon = fullType.match(/[\u{1F300}-\u{1F9FF}]/u)?.[0] || '💼';
                      const type = fullType.replace(/[\u{1F300}-\u{1F9FF}]/u, '').trim().toLowerCase();
                      
                      const newAsset = await assetsApi.create({
                        name: nameInput.value,
                        provider: providerInput.value,
                        type: type,
                        value: valueInput.value || 'N/A',
                        purchase: purchaseInput.value || 'N/A',
                        icon: icon
                      });
                      setAssets([...assets, { ...newAsset, status: 'active' }]);
                      setShowAddAssetModal(false);
                    } catch (error) {
                      console.error('Error creating asset:', error);
                      alert('Kunde inte skapa tillgången');
                    }
                  } else {
                    alert('Vänligen ange namn och provider');
                  }
                }}>Lägg till</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Asset */}
      {showEditAssetModal && editingAsset && (
        <div style={styles.modalOverlay} onClick={() => { setShowEditAssetModal(false); setEditingAsset(null); }}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>✏️ Redigera tillgång</h2>
            <div style={styles.modalForm}>
              <input type="text" defaultValue={editingAsset.name} style={styles.modalInput} id="editAssetName" />
              <input type="text" defaultValue={editingAsset.provider} style={styles.modalInput} id="editAssetProvider" />
              <select style={styles.modalInput} id="editAssetType" defaultValue={`${editingAsset.type || ''} ${editingAsset.icon || ''}`}>
                <option>Vehicle 🚗</option>
                <option>Computer 💻</option>
                <option>Fund 📈</option>
                <option>Stock 📊</option>
                <option>Banking 🏦</option>
                <option>Insurance 🛡️</option>
                <option>Property 🏠</option>
                <option>Electronics 📱</option>
                <option>Real Estate 🏡</option>
                <option>Collectibles 🎨</option>
                <option>Crypto ₿</option>
                <option>Savings 💰</option>
                <option>Investment 💎</option>
                <option>Other ⚡</option>
              </select>
              <input type="text" defaultValue={editingAsset.value} style={styles.modalInput} id="editAssetValue" />
              <input type="text" defaultValue={editingAsset.purchase} style={styles.modalInput} id="editAssetPurchase" />
              <div style={styles.modalActions}>
                <button style={styles.modalButton} onClick={() => { setShowEditAssetModal(false); setEditingAsset(null); }}>Avbryt</button>
                <button style={{...styles.modalButton, ...styles.modalButtonPrimary}} onClick={async () => {
                  const nameInput = document.getElementById('editAssetName') as HTMLInputElement;
                  const providerInput = document.getElementById('editAssetProvider') as HTMLInputElement;
                  const typeInput = document.getElementById('editAssetType') as HTMLSelectElement;
                  const valueInput = document.getElementById('editAssetValue') as HTMLInputElement;
                  const purchaseInput = document.getElementById('editAssetPurchase') as HTMLInputElement;
                  try {
                    // Extract type and icon from the combined select
                    const fullType = typeInput.value;
                    const icon = fullType.match(/[\u{1F300}-\u{1F9FF}]/u)?.[0] || '💼';
                    const type = fullType.replace(/[\u{1F300}-\u{1F9FF}]/u, '').trim().toLowerCase();
                    
                    await assetsApi.update(editingAsset.id, {
                      name: nameInput.value,
                      provider: providerInput.value,
                      type: type,
                      value: valueInput.value,
                      purchase: purchaseInput.value,
                      icon: icon
                    });
                    const updated = assets.map(a => 
                      a.id === editingAsset.id ? {
                        ...a,
                        name: nameInput.value,
                        provider: providerInput.value,
                        type: type,
                        value: valueInput.value,
                        purchase: purchaseInput.value,
                        icon: icon
                      } : a
                    );
                    setAssets(updated);
                    setShowEditAssetModal(false);
                    setEditingAsset(null);
                  } catch (error) {
                    console.error('Error updating asset:', error);
                    alert('Kunde inte uppdatera tillgången');
                  }
                }}>Spara</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <section style={styles.footer}>
        <div style={styles.statusContainer}>
          <span style={styles.statusBadge}>✅ Backend Online</span>
          <span style={styles.statusBadge}>🔒 Säker anslutning</span>
          <span style={styles.statusBadge}>🚀 Version 0.1.0</span>
        </div>
        <p style={styles.statusText}>
          CastleGate - Virtually Me | © 2025
        </p>
      </section>
    </div>
  );
}

const styles: any = {
  container: {
    minHeight: '100vh',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    background: '#f0f2f5',
  },
  header: {
    background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
    color: 'white',
    padding: '20px 40px',
    borderRadius: '16px',
    marginBottom: '30px',
    boxShadow: '0 4px 20px rgba(26, 35, 126, 0.3)',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  logo: {
    fontSize: '28px',
    fontWeight: 'bold',
  },
  tagline: {
    fontSize: '14px',
    opacity: 0.9,
    fontStyle: 'italic',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  notificationBtn: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    color: 'white',
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    fontSize: '20px',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  profileBtn: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    color: 'white',
    padding: '8px 20px',
    borderRadius: '25px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'background 0.2s',
  },
  profileIcon: {
    fontSize: '20px',
  },
  profileName: {
    fontSize: '16px',
    fontWeight: '500',
  },
  welcomeCard: {
    background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
    color: 'white',
    padding: '50px',
    borderRadius: '20px',
    marginBottom: '30px',
    boxShadow: '0 8px 32px rgba(26, 35, 126, 0.3)',
  },
  welcomeContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '30px',
  },
  avatar: {
    width: '100px',
    height: '100px',
    background: 'rgba(255, 255, 255, 0.25)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: '38px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  welcomeSubtitle: {
    fontSize: '18px',
    opacity: 0.95,
    marginBottom: '8px',
  },
  welcomeTime: {
    fontSize: '16px',
    opacity: 0.8,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    background: 'white',
    padding: '30px',
    borderRadius: '16px',
    textAlign: 'center',
    transition: 'all 0.3s',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  statIcon: {
    fontSize: '32px',
    marginBottom: '15px',
  },
  statValue: {
    fontSize: '42px',
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: '8px',
  },
  statTitle: {
    fontSize: '16px',
    color: '#757575',
    marginBottom: '5px',
    fontWeight: '500',
  },
  statChange: {
    fontSize: '13px',
    color: '#4caf50',
    fontWeight: '500',
  },
  tabsContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    borderBottom: '2px solid #e0e0e0',
    overflowX: 'auto',
  },
  tab: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '20px 30px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    borderBottom: '3px solid transparent',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
  tabActive: {
    borderBottom: '3px solid #1a237e',
    color: '#1a237e',
    fontWeight: 'bold',
  },
  content: {
    background: 'white',
    padding: '40px',
    borderRadius: '20px',
    marginBottom: '30px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  h2: {
    fontSize: '28px',
    margin: 0,
    color: '#1a237e',
    fontWeight: 'bold',
  },
  badge: {
    background: '#e3f2fd',
    color: '#1a237e',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  chipsContainer: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '30px',
  },
  chip: {
    background: '#e3f2fd',
    color: '#1a237e',
    padding: '10px 18px',
    borderRadius: '25px',
    fontSize: '14px',
    fontWeight: '500',
  },
  recommendationCard: {
    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
    border: '2px solid #1a237e',
    borderRadius: '16px',
    padding: '25px',
    marginBottom: '30px',
  },
  recommendationHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '15px',
  },
  recommendationIcon: {
    fontSize: '32px',
  },
  recommendationTitle: {
    fontSize: '20px',
    margin: 0,
    color: '#1a237e',
    fontWeight: 'bold',
  },
  recommendationSubtitle: {
    fontSize: '14px',
    margin: 0,
    color: '#3949ab',
  },
  recommendationText: {
    fontSize: '16px',
    marginBottom: '20px',
    color: '#212121',
    lineHeight: '1.6',
  },
  actionButton: {
    background: '#1a237e',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '25px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  quickActions: {
    marginTop: '30px',
  },
  quickActionsTitle: {
    fontSize: '20px',
    color: '#1a237e',
    marginBottom: '15px',
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
  },
  actionCard: {
    background: 'white',
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '14px',
    fontWeight: '500',
  },
  actionIcon: {
    fontSize: '28px',
  },
  addButton: {
    background: '#4caf50',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '25px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  searchBar: {
    marginBottom: '30px',
  },
  searchInput: {
    width: '100%',
    padding: '15px 20px',
    border: '2px solid #e0e0e0',
    borderRadius: '25px',
    fontSize: '16px',
  },
  documentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  documentItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '20px',
    background: 'white',
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    transition: 'all 0.2s',
    cursor: 'pointer',
  },
  documentIcon: {
    fontSize: '36px',
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '5px',
  },
  documentMeta: {
    fontSize: '14px',
    color: '#757575',
    display: 'flex',
    gap: '10px',
  },
  documentActions: {
    display: 'flex',
    gap: '10px',
  },
  iconButton: {
    background: 'transparent',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '8px',
  },
  textButton: {
    background: 'transparent',
    border: '2px solid #e0e0e0',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    padding: '8px 16px',
    borderRadius: '8px',
    color: '#212121',
    transition: 'all 0.2s',
  },
  walletBalance: {
    textAlign: 'center',
    padding: '30px',
    background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
    borderRadius: '20px',
    color: 'white',
    marginBottom: '30px',
  },
  balanceAmount: {
    fontSize: '56px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  balanceUSD: {
    fontSize: '18px',
    opacity: 0.9,
  },
  walletAddress: {
    marginBottom: '30px',
  },
  addressLabel: {
    fontSize: '14px',
    color: '#757575',
    marginBottom: '8px',
  },
  addressValue: {
    fontSize: '14px',
    color: '#212121',
    fontFamily: 'monospace',
    background: '#f5f5f5',
    padding: '12px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  copyButton: {
    background: 'transparent',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
  },
  actionButtons: {
    display: 'flex',
    gap: '15px',
    marginBottom: '30px',
  },
  primaryButton: {
    background: '#1a237e',
    color: 'white',
    border: 'none',
    padding: '15px 30px',
    borderRadius: '25px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    flex: 1,
  },
  secondaryButton: {
    background: 'white',
    color: '#1a237e',
    border: '2px solid #1a237e',
    padding: '15px 30px',
    borderRadius: '25px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  transactionsSection: {
    marginTop: '30px',
  },
  transactionsTitle: {
    fontSize: '20px',
    color: '#1a237e',
    marginBottom: '20px',
  },
  transactionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  transactionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    background: '#f9f9f9',
    borderRadius: '12px',
  },
  transactionIcon: {
    fontSize: '28px',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionLabel: {
    fontSize: '15px',
    fontWeight: '600',
    marginBottom: '4px',
  },
  transactionDate: {
    fontSize: '13px',
    color: '#757575',
  },
  transactionAmount: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  aiIntro: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  aiIcon: {
    fontSize: '64px',
    marginBottom: '20px',
  },
  aiTitle: {
    fontSize: '24px',
    color: '#1a237e',
    marginBottom: '10px',
  },
  aiSubtitle: {
    fontSize: '16px',
    color: '#757575',
    lineHeight: '1.6',
  },
  aiExamples: {
    marginBottom: '30px',
  },
  examplesTitle: {
    fontSize: '18px',
    color: '#1a237e',
    marginBottom: '15px',
  },
  exampleCard: {
    background: '#f9f9f9',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '12px',
  },
  exampleQ: {
    fontSize: '15px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#212121',
  },
  exampleA: {
    fontSize: '14px',
    color: '#757575',
    paddingLeft: '20px',
  },
  chatInput: {
    display: 'flex',
    gap: '10px',
  },
  chatInputField: {
    flex: 1,
    padding: '15px 20px',
    border: '2px solid #e0e0e0',
    borderRadius: '25px',
    fontSize: '16px',
  },
  chatSendButton: {
    background: '#1a237e',
    color: 'white',
    border: 'none',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    fontSize: '24px',
    cursor: 'pointer',
  },
  marketplaceIntro: {
    background: '#e3f2fd',
    borderLeft: '4px solid #1a237e',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '30px',
  },
  marketplaceText: {
    fontSize: '16px',
    lineHeight: '1.6',
    margin: 0,
  },
  categories: {
    marginBottom: '30px',
  },
  categoryRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  },
  categoryTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212121',
  },
  categoryTags: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  categoryTag: {
    background: 'white',
    border: '2px solid #e0e0e0',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
  },
  offersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  offerCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '25px',
    background: 'white',
    border: '2px solid #e0e0e0',
    borderRadius: '16px',
    transition: 'all 0.2s',
  },
  offerIcon: {
    fontSize: '48px',
  },
  offerContent: {
    flex: 1,
  },
  offerTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  offerProvider: {
    fontSize: '14px',
    color: '#757575',
    marginBottom: '8px',
  },
  offerBadge: {
    display: 'inline-block',
    background: '#4caf50',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '15px',
    fontSize: '12px',
    fontWeight: '600',
    marginRight: '10px',
  },
  offerSavings: {
    fontSize: '14px',
    color: '#4caf50',
    fontWeight: '600',
    marginTop: '8px',
  },
  offerButton: {
    background: '#1a237e',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '20px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  emptyOffers: {
    textAlign: 'center',
    padding: '40px',
    background: '#f9f9f9',
    borderRadius: '16px',
    marginTop: '30px',
  },
  emptySubtext: {
    fontSize: '14px',
    color: '#757575',
    marginTop: '10px',
  },
  footer: {
    textAlign: 'center',
    padding: '30px 20px',
    background: 'white',
    borderRadius: '16px',
  },
  statusContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    flexWrap: 'wrap',
    marginBottom: '15px',
  },
  statusBadge: {
    background: '#4caf50',
    color: 'white',
    padding: '8px 20px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
  },
  statusText: {
    color: '#757575',
    fontSize: '14px',
    marginTop: '10px',
  },
  emptyState: {
    color: '#757575',
    fontStyle: 'italic',
    fontSize: '16px',
  },
  paragraph: {
    fontSize: '16px',
    margin: '20px 0',
    lineHeight: '1.6',
  },
  assetsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  assetCard: {
    background: 'white',
    border: '2px solid #e0e0e0',
    borderRadius: '16px',
    padding: '25px',
    transition: 'all 0.2s',
  },
  assetHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '20px',
  },
  assetIcon: {
    fontSize: '40px',
  },
  assetName: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: 0,
    marginBottom: '4px',
  },
  assetProvider: {
    fontSize: '14px',
    color: '#757575',
    margin: 0,
  },
  assetDetails: {
    marginBottom: '20px',
  },
  assetRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    fontSize: '14px',
  },
  assetLabel: {
    color: '#757575',
  },
  assetValue: {
    fontWeight: '600',
    color: '#212121',
  },
  assetStatus: {
    fontWeight: '600',
  },
  assetActions: {
    display: 'flex',
    gap: '10px',
  },
  viewButton: {
    flex: 1,
    background: '#e3f2fd',
    color: '#1a237e',
    border: 'none',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  manageButton: {
    flex: 1,
    background: 'white',
    color: '#1a237e',
    border: '2px solid #1a237e',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  totalValue: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#4caf50',
    background: '#e8f5e9',
    padding: '10px 20px',
    borderRadius: '25px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: 'white',
    borderRadius: '20px',
    padding: '30px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#1a237e',
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  modalInput: {
    padding: '12px 16px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '16px',
    fontFamily: 'inherit',
  },
  modalActions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
    marginTop: '10px',
  },
  modalButton: {
    padding: '12px 24px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    background: 'white',
    transition: 'all 0.2s',
  },
  modalButtonPrimary: {
    background: '#1a237e',
    color: 'white',
    border: '2px solid #1a237e',
  },
  settingsCard: {
    background: 'white',
    border: '2px solid #e0e0e0',
    borderRadius: '16px',
    padding: '25px',
    marginBottom: '20px',
  },
  settingsTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#212121',
  },
  settingsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  settingItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '15px',
    background: '#f9f9f9',
    borderRadius: '12px',
  },
  settingLabel: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#212121',
  },
  settingSelect: {
    padding: '10px 15px',
    borderRadius: '8px',
    border: '2px solid #e0e0e0',
    fontSize: '14px',
    background: 'white',
  },
  checkbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
  },
  settingsDesc: {
    fontSize: '14px',
    color: '#757575',
    marginTop: '10px',
    fontStyle: 'italic',
  },
  dangerButton: {
    background: '#f44336',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    marginBottom: '10px',
    transition: 'all 0.2s',
  },
};