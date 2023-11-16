<?php

namespace App\Entity;

use App\Repository\AdviceRepository;
use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

use App\Controller\ActAdvice;

/**
 * @ApiResource(
 *      collectionOperations={},
 *      itemOperations={
 *      "act"={
 *              "method"="GET",
 *              "path"="/advice/{id}/act",
 *              "controller"=ActAdvice::class
 *      }},
 *      normalizationContext={"groups"={"advice:read"}}

 * )
 * @ORM\Entity(repositoryClass=AdviceRepository::class)
 */
class Advice
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"room:read", "advice:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="datetime")
     */
    private $endDate;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"room:read", "advice:read"})
     */
    private $acted;

    /**
     * @Groups({"room:read", "advice:read"})
     * @ORM\Column(type="string", length=1000, nullable=true)
     */
    private $sentence;

    /**
     * @ORM\Column(type="array")
     */
    private $types = []; // list of types there is a problem : exemple ["temp", "hum"] significate that there is a problem with temperature and humidity

    public function __construct()
    {
        $this->acted = false;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEndDate(): ?\DateTimeInterface
    {
        return $this->endDate;
    }

    public function setEndDate(\DateTimeInterface $endDate): self
    {
        $this->endDate = $endDate;

        return $this;
    }

    public function isActed(): ?bool
    {
        return $this->acted;
    }

    public function setActed(bool $acted): self
    {
        $this->acted = $acted;

        return $this;
    }

    public function getSentence(): ?string
    {
        return $this->sentence;
    }

    public function setSentence(?string $sentence): self
    {
        $this->sentence = $sentence;

        return $this;
    }

    public function getTypes(): ?array
    {
        return $this->types;
    }

    public function setTypes(array $types): self
    {
        $this->types = $types;

        return $this;
    }
}
