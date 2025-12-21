import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pricingSettingsApi } from "@/app/api/pricingSettings";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { DollarCircle, MoneyChange, Calculator } from "iconsax-react";

export function PricingSettingsPage() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["pricing-settings"],
    queryFn: () => pricingSettingsApi.getSettings(),
  });

  const [formData, setFormData] = useState({
    exchangeRate: settings?.exchangeRate || 655,
    marginPercentage: settings?.marginPercentage || 20,
    marginType: settings?.marginType || "percentage",
    fixedMargin: settings?.fixedMargin || 0,
    currency: settings?.currency || "USD",
  });

  const [previewPrice, setPreviewPrice] = useState("");
  const [previewComparePrice, setPreviewComparePrice] = useState("");
  const [calculatedPrices, setCalculatedPrices] = useState<any>(null);

  useEffect(() => {
    if (settings) {
      setFormData({
        exchangeRate: settings.exchangeRate,
        marginPercentage: settings.marginPercentage,
        marginType: settings.marginType,
        fixedMargin: settings.fixedMargin || 0,
        currency: settings.currency,
      });
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => pricingSettingsApi.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing-settings"] });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateMutation.mutateAsync(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "marginType" || name === "currency" ? value : Number(value),
    }));
  };

  const handleCalculatePreview = async () => {
    if (!previewPrice) return;

    try {
      const result = await pricingSettingsApi.calculatePrice(
        Number(previewPrice),
        previewComparePrice ? Number(previewComparePrice) : undefined
      );
      setCalculatedPrices(result);
    } catch (error) {
      console.error("Error calculating preview:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Paramètres de Prix
        </h1>
        <p className="text-gray-600">
          Configurez le taux de change et la marge bénéficiaire pour le calcul automatique des prix
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <MoneyChange size={20} className="text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Configuration</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Currency */}
            <Select
              label="Devise source"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              options={[
                { value: "USD", label: "Dollar américain (USD)" },
                { value: "EUR", label: "Euro (EUR)" },
              ]}
            />

            {/* Exchange Rate */}
            <Input
              label={`Taux de change (1 ${formData.currency} = ? XOF)`}
              name="exchangeRate"
              type="number"
              step="0.01"
              value={formData.exchangeRate}
              onChange={handleChange}
              required
              placeholder="655"
            />

            {/* Margin Type */}
            <Select
              label="Type de marge"
              name="marginType"
              value={formData.marginType}
              onChange={handleChange}
              options={[
                { value: "percentage", label: "Pourcentage" },
                { value: "fixed", label: "Montant fixe (XOF)" },
              ]}
            />

            {/* Margin Value */}
            {formData.marginType === "percentage" ? (
              <Input
                label="Marge bénéficiaire (%)"
                name="marginPercentage"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.marginPercentage}
                onChange={handleChange}
                required
                placeholder="20"
              />
            ) : (
              <Input
                label="Marge fixe (XOF)"
                name="fixedMargin"
                type="number"
                step="1"
                min="0"
                value={formData.fixedMargin}
                onChange={handleChange}
                required
                placeholder="10000"
              />
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={updateMutation.isPending}
              className="w-full"
            >
              {updateMutation.isPending ? "Enregistrement..." : "Enregistrer les paramètres"}
            </Button>

            {updateMutation.isSuccess && (
              <p className="text-sm text-green-600 text-center">
                ✓ Paramètres enregistrés avec succès
              </p>
            )}
          </form>

          {/* Formula Display */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Formule de calcul :</p>
            <div className="text-sm text-gray-600 font-mono">
              {formData.marginType === "percentage" ? (
                <p>
                  Prix final = (Prix scrapé × {formData.exchangeRate}) × (1 + {formData.marginPercentage}%)
                </p>
              ) : (
                <p>
                  Prix final = (Prix scrapé × {formData.exchangeRate}) + {formData.fixedMargin} XOF
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Price Calculator Preview */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Calculator size={20} className="text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Calculateur de prix</h2>
          </div>

          <div className="space-y-4">
            <Input
              label={`Prix scrapé (${formData.currency})`}
              type="number"
              step="0.01"
              value={previewPrice}
              onChange={(e) => setPreviewPrice(e.target.value)}
              placeholder="29.99"
            />

            <Input
              label={`Prix comparé scrapé (${formData.currency}) - Optionnel`}
              type="number"
              step="0.01"
              value={previewComparePrice}
              onChange={(e) => setPreviewComparePrice(e.target.value)}
              placeholder="39.99"
            />

            <Button
              type="button"
              onClick={handleCalculatePreview}
              variant="outline"
              className="w-full"
              disabled={!previewPrice}
            >
              <DollarCircle size={18} />
              Calculer le prix
            </Button>

            {calculatedPrices && (
              <div className="mt-6 space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Prix de vente final</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {calculatedPrices.price.toLocaleString()} XOF
                  </p>
                </div>

                {calculatedPrices.compareAtPrice && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Prix comparé final</p>
                    <p className="text-xl font-semibold text-gray-700">
                      {calculatedPrices.compareAtPrice.toLocaleString()} XOF
                    </p>
                  </div>
                )}

                {previewPrice && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-600 mb-2">Détails du calcul :</p>
                    <div className="text-xs text-gray-700 space-y-1 font-mono">
                      <p>Prix source: {previewPrice} {formData.currency}</p>
                      <p>Taux de change: 1 {formData.currency} = {formData.exchangeRate} XOF</p>
                      <p>Prix en XOF: {(Number(previewPrice) * formData.exchangeRate).toFixed(0)} XOF</p>
                      {formData.marginType === "percentage" ? (
                        <p>Marge: +{formData.marginPercentage}%</p>
                      ) : (
                        <p>Marge: +{formData.fixedMargin} XOF</p>
                      )}
                      <p className="font-bold pt-2 border-t border-green-300">
                        Prix final: {calculatedPrices.price.toLocaleString()} XOF
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Information */}
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>Note :</strong> Ces paramètres seront automatiquement utilisés par l'extension de scraping
              pour calculer les prix lors de l'importation de produits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
